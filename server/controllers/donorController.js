const Donor = require('../models/Donor');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');

exports.getAllDonors = async (req, res, next) => {
  try {
    const { bloodGroup, district, search, available, page = 1, limit = 12 } = req.query;

    const query = {};
    const userQuery = { role: 'donor', isActive: true, isApproved: true };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (available === 'true') query.isAvailable = true;

    if (district || search) {
      const andConditions = [];
      if (district) {
        andConditions.push({
          $or: [
            { 'address.district': new RegExp(district, 'i') },
            { address: new RegExp(district, 'i') }
          ]
        });
      }
      if (search) {
        andConditions.push({
          $or: [
            { name: new RegExp(search, 'i') },
            { phone: new RegExp(search, 'i') }
          ]
        });
      }
      userQuery.$and = andConditions;
    }

    // Find valid users first based on search/district and status
    const users = await User.find(userQuery).select('_id');
    const userIds = users.map(u => u._id);
    
    query.userId = { $in: userIds };

    const startIndex = (page - 1) * limit;
    const total = await Donor.countDocuments(query);

    const donors = await Donor.find(query)
      .populate({
        path: 'userId',
        select: 'name phone avatar address'
      })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: donors.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      donors
    });
  } catch (error) {
    next(error);
  }
};

exports.getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate({
      path: 'userId',
      select: '-password'
    });

    if (!donor) {
      return next(new ErrorResponse('Donor not found', 404));
    }

    res.status(200).json({
      success: true,
      donor
    });
  } catch (error) {
    next(error);
  }
};

exports.getDonorsByBloodGroup = async (req, res, next) => {
  try {
    const bloodGroup = decodeURIComponent(req.params.group);
    
    const donors = await Donor.find({ bloodGroup, isAvailable: true })
      .populate({
        path: 'userId',
        match: { isActive: true, isApproved: true },
        select: 'name phone avatar address'
      });

    // Filter out donors where the populated userId is null (meaning user isn't active/approved)
    const activeDonors = donors.filter(d => d.userId != null);

    res.status(200).json({
      success: true,
      count: activeDonors.length,
      donors: activeDonors
    });
  } catch (error) {
    next(error);
  }
};

exports.getDonorStats = async (req, res, next) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ isAvailable: true });
    
    const stats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {};
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      totalDonors,
      availableDonors,
      bloodGroupStats: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });

    if (!donor) {
      return next(new ErrorResponse('Donor profile not found', 404));
    }

    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    res.status(200).json({
      success: true,
      isAvailable: donor.isAvailable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new donor (volunteer/admin)
// @route   POST /api/donors
// @access  Private (volunteer, admin)
exports.addDonor = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, bloodGroup, lastDonationDate, lastDonation, isAvailable } = req.body;

    if (!bloodGroup) {
      return next(new ErrorResponse('রক্তের গ্রুপ আবশ্যক', 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('এই ইমেইল আগে ব্যবহার হয়েছে', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'donor',
      address,
      isApproved: true,
      isActive: true,
    });

    const donor = await Donor.create({
      userId: user._id,
      bloodGroup,
      lastDonationDate: (lastDonationDate || lastDonation) ? new Date(lastDonationDate || lastDonation) : null,
      isAvailable: isAvailable !== undefined ? !!isAvailable : true,
    });

    res.status(201).json({
      success: true,
      donor,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a donor by ID (volunteer/admin)
// @route   PUT /api/donors/:id
// @access  Private (volunteer, admin)
exports.updateDonor = async (req, res, next) => {
  try {
    const { name, email, phone, address, bloodGroup, lastDonationDate, lastDonation, isAvailable, weight, dateOfBirth, medicalConditions } = req.body;

    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return next(new ErrorResponse('ডোনার পাওয়া যায়নি', 404));
    }

    // Update linked user info
    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (email !== undefined) userUpdate.email = email;
    if (phone !== undefined) userUpdate.phone = phone;
    if (address !== undefined) userUpdate.address = address;
    await User.findByIdAndUpdate(donor.userId, userUpdate, {
      new: true,
      runValidators: true,
    });

    // Update donor-specific info
    const donorUpdate = {};
    if (bloodGroup !== undefined) donorUpdate.bloodGroup = bloodGroup;
    if (lastDonationDate !== undefined || lastDonation !== undefined) {
      donorUpdate.lastDonationDate = new Date(lastDonationDate || lastDonation || null);
    }
    if (isAvailable !== undefined) donorUpdate.isAvailable = !!isAvailable;
    if (weight !== undefined) donorUpdate.weight = weight;
    if (dateOfBirth !== undefined) donorUpdate.dateOfBirth = dateOfBirth;
    if (medicalConditions !== undefined) donorUpdate.medicalConditions = medicalConditions;

    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      donorUpdate,
      { new: true, runValidators: true }
    ).populate({ path: 'userId', select: 'name phone email avatar address' });

    res.status(200).json({
      success: true,
      donor: updatedDonor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a donor by ID (volunteer/admin)
// @route   DELETE /api/donors/:id
// @access  Private (volunteer, admin)
exports.deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return next(new ErrorResponse('ডোনার পাওয়া যায়নি', 404));
    }

    await User.findByIdAndDelete(donor.userId);
    await donor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'ডোনার মুছে ফেলা হয়েছে',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle availability of a specific donor by ID (volunteer/admin)
// @route   PATCH /api/donors/:id/availability
// @access  Private (volunteer, admin)
exports.toggleDonorAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return next(new ErrorResponse('ডোনার পাওয়া যায়নি', 404));
    }

    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    res.status(200).json({
      success: true,
      isAvailable: donor.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};
