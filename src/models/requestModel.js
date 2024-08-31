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
    required: true
  },
  requestedPickUpDays: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: true
  },
  selectedChildren: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(\(\d{3}\)\s?|\d{3}[-.]?)\d{3}[-.]?\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
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