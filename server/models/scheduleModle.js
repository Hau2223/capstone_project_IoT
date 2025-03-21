const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  status: {
    type: Boolean,
    default: false,
  },
  timeOfDay: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // second/minute
    required: true,
  },
  repeat: {
    type: [String],
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
