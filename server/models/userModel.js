const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  deviceID: {
    type: String,
    default: '',
  },
  gardenId: {
    type: [String],
    default: [],
    ref: 'Device',
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
  token: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
