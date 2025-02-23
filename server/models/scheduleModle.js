const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  id_sensor: {
    type: String,
    require: true,
    req: 'Sensor',
  },
  datetime_start: {
    type: Date,
  },
  datetime_end: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
