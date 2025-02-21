const mongoose = require('mongoose');

const sensorTypeSchema = new mongoose.Schema({
  name_device: {
    type: String,
  },
});

const SensorType = mongoose.model('SensorType', sensorTypeSchema);
module.exports = SensorType;
