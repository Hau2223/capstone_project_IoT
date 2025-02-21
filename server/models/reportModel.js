const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: '',
  },
  id_device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    default: '',
  },
  id_sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    default: '',
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
