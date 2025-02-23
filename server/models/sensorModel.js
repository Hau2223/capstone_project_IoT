const mongoose = require('mongoose');

const booleanControl = {
  on: {type: Boolean, default: false},
  off: {type: Boolean, default: false},
  auto: {type: Boolean, default: false},
};

const SensorDataSchema = new mongoose.Schema({
  idDevice: {
    type: String,
    ref: 'Device',
  },
  idSensorType: {
    type: String,
    ref: 'SensorType',
  },
  unit: {
    type: Number,
    default: 0,
  },
  control: {
    pump: booleanControl,
    fan: booleanControl,
    light: booleanControl,
  },
  threshold: {
    type: Number,
    default: 0,
  },
});

// Method to update control based on device active status
SensorDataSchema.methods.updateControl = function (deviceActive) {
  if (deviceActive) {
    this.control.pump.on = true;
    this.control.pump.off = false;
    this.control.fan.on = true;
    this.control.fan.off = false;
    this.control.light.on = true;
    this.control.light.off = false;
  } else {
    this.control.pump.on = false;
    this.control.pump.off = true;
    this.control.fan.on = false;
    this.control.fan.off = true;
    this.control.light.on = false;
    this.control.light.off = true;
  }
};

const Sensor = mongoose.model('Sensor', SensorDataSchema);
module.exports = Sensor;
