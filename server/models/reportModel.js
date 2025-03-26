const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  time_created: {
    type: Date,
    default: Date.now,
  },
  water_usage: {
    type: Number,
    required: true,
  },
  water_duration: {
    type: Number,
    required: true,
  },
  light_usage: {
    type: Number,
    required: true,
  },
  light_duration: {
    type: Number,
    required: true,
  },
}); // Adds createdAt and updatedAt automatically

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
