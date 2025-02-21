const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  idDevice: {
    type: String,
    required: true,
  },
  ipDevice: {
    type: String,
    required: true,
  },
  name_device: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
