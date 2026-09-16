const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');
const { ErrorResponse } = require('../middleware/errorHandler');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, isApproved, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    next(error);
  }
};

exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true, runValidators: false }
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true, runValidators: false }
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true, runValidators: false }
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User unbanned / reactivated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalDonations = await DonationHistory.countDocuments();
    const pendingApprovals = await User.countDocuments({ isApproved: false });
    const totalBloodRequests = await BloodRequest.countDocuments();
    
    const bloodGroupStatsRaw = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);
    
    const bloodGroupStats = {};
    bloodGroupStatsRaw.forEach(stat => {
      bloodGroupStats[stat._id] = stat.count;
    });

    const recentDonations = await DonationHistory.find()
      .populate('donorId', 'name')
      .sort('-donationDate')
      .limit(5);

    const monthlyStats = await DonationHistory.aggregate([
      {
        $group: {
          _id: { $month: '$donationDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        totalVolunteers,
        totalDonations,
        pendingApprovals,
        totalBloodRequests,
        bloodGroupStats,
        recentDonations,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPendingApprovals = async (req, res, next) => {
  try {
    const users = await User.find({ isApproved: false })
      .select('-password')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};
