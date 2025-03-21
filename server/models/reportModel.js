const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
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
});

const History = mongoose.model('History', reportSchema);
module.exports = History;
