const BloodRequest = require('../models/BloodRequest');
const { ErrorResponse } = require('../middleware/errorHandler');

exports.createRequest = async (req, res, next) => {
  try {
    req.body.requesterId = req.user.id;
    if (req.body.contactPhone && !req.body.contactNumber) {
      req.body.contactNumber = req.body.contactPhone;
    }

    const request = await BloodRequest.create(req.body);

    res.status(201).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    const { bloodGroup, status, urgency, page = 1, limit = 10 } = req.query;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;

    const startIndex = (page - 1) * limit;
    const total = await BloodRequest.countDocuments(query);

    const requests = await BloodRequest.find(query)
      .populate('requesterId', 'name phone')
      .populate('assignedDonor', 'name phone')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      requests
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ requesterId: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requesterId', 'name phone email address')
      .populate('assignedDonor', 'name phone')
      .populate('assignedVolunteer', 'name phone');

    if (!request) {
      return next(new ErrorResponse('Blood request not found', 404));
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRequest = async (req, res, next) => {
  try {
    let request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return next(new ErrorResponse('Blood request not found', 404));
    }

    // Requester, volunteer, or admin can update
    const isOwner = request.requesterId.toString() === req.user.id;
    const isPrivileged = ['admin', 'volunteer'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return next(new ErrorResponse('Not authorized to update this blood request', 403));
    }

    const { status, assignedDonor, assignedVolunteer, notes, patientName, hospital, urgency, unitsNeeded, contactNumber, contactPhone } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Only volunteer/admin can assign
    if (isPrivileged) {
      if (assignedDonor !== undefined) updateData.assignedDonor = assignedDonor;
      if (assignedVolunteer !== undefined) updateData.assignedVolunteer = assignedVolunteer;
    }

    // Owner can edit patient info if still pending
    if (isOwner && request.status === 'pending') {
      if (patientName) updateData.patientName = patientName;
      if (hospital) updateData.hospital = hospital;
      if (urgency) updateData.urgency = urgency;
      if (unitsNeeded) updateData.unitsNeeded = unitsNeeded;
      if (contactNumber || contactPhone) updateData.contactNumber = contactNumber || contactPhone;
    }

    request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return next(new ErrorResponse('Blood request not found', 404));
    }

    // Only requester or admin can delete
    const isOwner = request.requesterId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new ErrorResponse('Not authorized to delete this blood request', 403));
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
