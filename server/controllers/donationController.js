const DonationHistory = require('../models/DonationHistory');
const Donor = require('../models/Donor');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Record a donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res, next) => {
  try {
    const { donorId, requestId, donationDate, hospital, notes } = req.body;

    // A donor records their own donation, or admin/volunteer can specify donorId
    let targetDonorId = req.user.id;
    if (['admin', 'volunteer'].includes(req.user.role) && donorId) {
      targetDonorId = donorId;
    }

    const donation = await DonationHistory.create({
      donorId: targetDonorId,
      requestId,
      donationDate: donationDate || new Date(),
      hospital,
      notes,
      verifiedBy: ['admin', 'volunteer'].includes(req.user.role) ? req.user.id : undefined
    });

    // Update Donor profile stats
    await Donor.findOneAndUpdate(
      { userId: targetDonorId },
      {
        $inc: { totalDonations: 1 },
        $set: { lastDonationDate: donationDate || new Date() }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's donation history
// @route   GET /api/donations/my
// @access  Private
exports.getMyDonations = async (req, res, next) => {
  try {
    const donations = await DonationHistory.find({ donorId: req.user.id })
      .populate('requestId', 'patientName bloodGroup hospital')
      .populate('verifiedBy', 'name role')
      .sort('-donationDate');

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (admin & volunteer)
// @route   GET /api/donations
// @access  Private (Admin, Volunteer)
exports.getAllDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const total = await DonationHistory.countDocuments();

    const donations = await DonationHistory.find()
      .populate('donorId', 'name email phone avatar')
      .populate('requestId', 'patientName bloodGroup hospital')
      .populate('verifiedBy', 'name role')
      .sort('-donationDate')
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a donation
// @route   PUT /api/donations/:id/verify
// @access  Private (Admin, Volunteer)
exports.verifyDonation = async (req, res, next) => {
  try {
    const donation = await DonationHistory.findById(req.params.id);

    if (!donation) {
      return next(new ErrorResponse('Donation record not found', 404));
    }

    donation.verifiedBy = req.user.id;
    donation.status = req.body.status === 'pending' ? 'pending' : 'completed';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation verified successfully',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a donation record
// @route   PUT /api/donations/:id
// @access  Private (Donor can update own record, Admin/Volunteer can update any)
exports.updateDonation = async (req, res, next) => {
  try {
    const { donationDate, hospital, notes } = req.body;

    const donation = await DonationHistory.findById(req.params.id);

    if (!donation) {
      return next(new ErrorResponse('Donation record not found', 404));
    }

    const isOwner = donation.donorId.toString() === req.user.id;
    const isAdminOrVolunteer = ['admin', 'volunteer'].includes(req.user.role);

    if (!isOwner && !isAdminOrVolunteer) {
      return next(new ErrorResponse('Not authorized to update this donation record', 403));
    }

    if (donationDate !== undefined) donation.donationDate = donationDate;
    if (hospital !== undefined) donation.hospital = hospital;
    if (notes !== undefined) donation.notes = notes;

    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation record updated successfully',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a donation record
// @route   DELETE /api/donations/:id
// @access  Private (Donor can delete own record, Admin/Volunteer can delete any)
exports.deleteDonation = async (req, res, next) => {
  try {
    const donation = await DonationHistory.findById(req.params.id);

    if (!donation) {
      return next(new ErrorResponse('Donation record not found', 404));
    }

    const isOwner = donation.donorId.toString() === req.user.id;
    const isAdminOrVolunteer = ['admin', 'volunteer'].includes(req.user.role);

    if (!isOwner && !isAdminOrVolunteer) {
      return next(new ErrorResponse('Not authorized to delete this donation record', 403));
    }

    await donation.deleteOne();

    // Decrement the donor's totalDonations counter
    await Donor.findOneAndUpdate(
      { userId: donation.donorId },
      { $inc: { totalDonations: -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Donation record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
