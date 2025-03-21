const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  id_esp: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: [String],
        enum: ['owner', 'member'],
        default: 'member',
      },
    },
  ],
  sensorIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sensor',
    },
  ],
  controlIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Control',
    },
  ],
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
