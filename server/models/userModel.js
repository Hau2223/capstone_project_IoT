const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  deviceID: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  full_name: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
