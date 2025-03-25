const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  type: {
    type: String,
    enum: ['moisture', 'light', 'rain', 'temperature', 'humidity', 'water_flow'],
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
});

const Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;
