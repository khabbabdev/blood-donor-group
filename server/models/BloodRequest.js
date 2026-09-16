const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Please add patient name']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please select a blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  hospital: {
    type: String,
    required: [true, 'Please add hospital name']
  },
  location: {
    type: String
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    default: 'normal'
  },
  unitsNeeded: {
    type: Number,
    default: 1
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number']
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedDonor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
