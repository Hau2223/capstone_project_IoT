const mongoose = require('mongoose');

const controlSchema = new mongoose.Schema({
  id_User: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  id_Device: {
    type: String,
    ref: 'Device',
    required: true,
  },
});

const Control = mongoose.model('Control', controlSchema);
module.exports = Control;
