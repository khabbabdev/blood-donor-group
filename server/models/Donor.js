const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add a blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  dateOfBirth: {
    type: Date
  },
  weight: {
    type: Number
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  medicalConditions: {
    type: [String],
    default: []
  },
  badges: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for eligibility
DonorSchema.virtual('isEligible').get(function() {
  if (!this.lastDonationDate) {
    return true;
  }
  const diffTime = Math.abs(new Date() - this.lastDonationDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 90;
});

module.exports = mongoose.model('Donor', DonorSchema);
