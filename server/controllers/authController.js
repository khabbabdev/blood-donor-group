const User = require('../models/User');
const Donor = require('../models/Donor');
const { ErrorResponse } = require('../middleware/errorHandler');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'donor', bloodGroup, address, lastDonationDate, lastDonation } = req.body;

    // Prevent direct registration as admin
    if (role === 'admin') {
      return next(new ErrorResponse('Direct registration as admin is not permitted', 403));
    }

    const assignedRole = role === 'volunteer' ? 'volunteer' : 'donor';

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('এই ইমেইল বা মোবাইল নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে', 400));
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new ErrorResponse('এই ইমেইল বা মোবাইল নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: assignedRole,
      address,
      isApproved: assignedRole === 'donor' // Volunteers require admin approval
    });

    if (assignedRole === 'donor') {
      if (!bloodGroup) {
        // Rollback user creation
        await User.findByIdAndDelete(user._id);
        return next(new ErrorResponse('Blood group is required for donors', 400));
      }

      try {
        await Donor.create({
          userId: user._id,
          bloodGroup,
          lastDonationDate: lastDonationDate || lastDonation || null
        });
      } catch (donorErr) {
        await User.findByIdAndDelete(user._id);
        return next(donorErr);
      }
    }

    const token = user.isApproved ? user.getSignedJwtToken() : null;

    res.status(201).json({
      success: true,
      ...(token ? { token } : {}),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      },
      message: user.isApproved 
        ? 'Registration successful' 
        : 'Registration successful. Account pending admin approval.'
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(new ErrorResponse('Please provide an email or phone number and password', 400));
    }

    // Support login with either email or phone number
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier }
      ]
    }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('Your account has been deactivated', 403));
    }

    if (!user.isApproved) {
      return next(new ErrorResponse('Your account is pending approval', 403));
    }

    const token = user.getSignedJwtToken();

    user.password = undefined; // Don't send password back

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    let responseData = { user };

    if (user.role === 'donor') {
      const donorInfo = await Donor.findOne({ userId: user._id });
      responseData.donorInfo = donorInfo;
    }

    res.status(200).json({
      success: true,
      ...responseData
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar, address, weight, dateOfBirth, medicalConditions, lastDonationDate, lastDonation } = req.body;

    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (email !== undefined) userUpdate.email = email;
    if (phone !== undefined) userUpdate.phone = phone;
    if (avatar !== undefined) userUpdate.avatar = avatar;
    if (address !== undefined) userUpdate.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      userUpdate,
      { new: true, runValidators: true }
    );

    let donorInfo = null;
    if (req.user.role === 'donor') {
      const donorUpdate = {};
      if (weight !== undefined) donorUpdate.weight = weight;
      if (dateOfBirth !== undefined) donorUpdate.dateOfBirth = dateOfBirth;
      if (medicalConditions !== undefined) donorUpdate.medicalConditions = medicalConditions;
      if (lastDonationDate !== undefined || lastDonation !== undefined) {
        donorUpdate.lastDonationDate = lastDonationDate || lastDonation;
      }

      donorInfo = await Donor.findOneAndUpdate(
        { userId: req.user.id },
        donorUpdate,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      donorInfo
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Please provide current and new password', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save(); // This will trigger the pre-save hook to hash the password

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email || req.body.identifier;
    if (!email) {
      return next(new ErrorResponse('ইমেইল ঠিকানা দেওয়া আবশ্যক', 400));
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user strictly by email address
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      return next(new ErrorResponse('এই ইমেইল ঠিকানায় কোনো অ্যাকাউন্ট পাওয়া যায়নি', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Blood Donor Group account.</p>
      <p>Please click the link below to reset your password. This link will expire in 10 minutes:</p>
      <p><a href="${resetUrl}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>Or copy this link: ${resetUrl}</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    let emailSent = false;
    const isRealSMTP = process.env.SMTP_USER && 
                      process.env.SMTP_USER !== 'your_email@gmail.com' && 
                      process.env.SMTP_PASS && 
                      process.env.SMTP_PASS !== 'your_app_password';

    if (isRealSMTP) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Password Reset Token - Blood Donor Group',
          html: message
        });
        emailSent = true;
      } catch (err) {
        console.error('SMTP Email Send Error:', err.message);
      }
    }

    if (process.env.NODE_ENV === 'development' || !emailSent) {
      console.log('----------------------------------------------------');
      console.log(`PASSWORD RESET LINK FOR ${user.email}:`);
      console.log(resetUrl);
      console.log('----------------------------------------------------');

      return res.status(200).json({
        success: true,
        message: (isRealSMTP && emailSent)
          ? 'রিসেট লিংক ইমেইলে পাঠানো হয়েছে'
          : 'পাসওয়ার্ড রিসেট লিংক প্রস্তুত করা হয়েছে',
        resetToken,
        resetUrl
      });
    }

    res.status(200).json({
      success: true,
      message: 'পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return next(new ErrorResponse('Please provide a password of at least 6 characters', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};
