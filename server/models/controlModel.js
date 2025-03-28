const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const controlSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  threshold_min: {
    type: Number,
    default: 0,
  },
  threshold_max: {
    type: Number,
    default: 100,
  },
  mode: {
    type: String,
    enum: ['manual', 'schedule', 'threshold'],
    default: 'manual',
  },
});

const Control = mongoose.model('Control', controlSchema);
module.exports = Control;
