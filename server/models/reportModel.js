const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
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
    moisture_avg: {
      type: [Number],
      default: [], //[12,23]
    },
    luminosity_avg: {
      type: [Number],
      default: [],
    },
    tempurature_avg: {
      type: [Number],
      default: [],
    },
    humidity_avg: {
      type: [Number],
      default: [],
    },
    stream_avg: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true, // <-- Important
  },
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
