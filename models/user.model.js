const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'trainer', 'trainee'], default: 'trainee' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
