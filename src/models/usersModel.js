const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // Required during registration
    parentName: {
        type: String,
        required: [true, 'Please provide a parent name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    childrenNames: {
        type: [
            String
        ],
        default: [],
    },
    numberOfSeatsInCar: {
        type: Number,
        default: 0
    },
    availableDropOffDays: {
        type: [
            String
        ],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        default: [],
    },
    availablePickUpDays: {
        type: [
            String
        ],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        default: [],
    },
    neighborhood: {
        type: String,
        default: " "
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(\(\d{3}\)\s?|\d{3}[-.]?)\d{3}[-.]?\d{4}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
},
    {
        timestamps: true
    });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign(
      {
        userId: this._id,
        email: this.email,
        parentName: this.parentName
      },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();  // Save the updated user document
    return token;
};


userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch
};

const User = mongoose.model('users', userSchema);

module.exports = User;
