const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  soilMoisture: Number,
  temperature: Number,
  humidity: Number,
  rainCover: Number,
  lightIntensity: Number,
  timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
