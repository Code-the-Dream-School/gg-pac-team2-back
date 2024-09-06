const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  requestedDropOffDays: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: false
  },
  requestedPickUpDays: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = RideRequest;