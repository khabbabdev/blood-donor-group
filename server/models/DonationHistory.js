const mongoose = require('mongoose');

const DonationHistorySchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  donationDate: {
    type: Date,
    required: [true, 'Please add a donation date']
  },
  hospital: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'completed'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DonationHistory', DonationHistorySchema);
