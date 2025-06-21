const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'trainer', 'trainee'], default: 'trainee' },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^01\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid 11-digit phone number!`
    },
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
