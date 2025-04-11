const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  id_esp: {
    type: String,
    required: true,
  },
  name_area: {
    type: String,
    default: '',
  },
  img_area: {
    type: String,
    default:
      'https://static.vinwonders.com/production/LzmCCdos-vuon-tieu-phu-quoc-1.jpg',
  },
  update_at: {
    type: Date,
    default: '',
  },
  create_at: {
    type: Date,
    default: '',
  },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        enum: ['owner', 'member'],
        default: 'member',
      },
    },
  ],
  sensors: [
    {
      type: {
        type: String,
        enum: [
          'moisture',
          'luminosity',
          'rain',
          'temperature',
          'humidity',
          'stream',
        ],
        default: 'moisture',
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
  controls: [
    {
      name: {
        type: String,
        enum: ['water', 'light', 'wind'],
        default: null,
        // required: true,
      },
      status: {
        type: Boolean,
        default: false,
      },
      threshold_min: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      threshold_max: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },

      mode: {
        type: String,
        enum: ['manual', 'schedule', 'threshold'],
        default: 'manual',
      },
      schedules: [
        {
          status: {
            type: Boolean,
            default: false,
          },
          startTime: {
            type: String, // Thay vì Date
            default: () => {
              const now = new Date();
              const hour = now.getHours();
              const minute = now.getMinutes();
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const formattedHour = (hour % 12 || 12)
                .toString()
                .padStart(2, '0');
              const formattedMinute = minute.toString().padStart(2, '0');
              return `${formattedHour}:${formattedMinute} ${ampm}`;
            },
          },
          duration: {
            type: Number,
            default: 0,
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
            default: 'Monday',
          },
        },
      ],
    },
  ],
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
