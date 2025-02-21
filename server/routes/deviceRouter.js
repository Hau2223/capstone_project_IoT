const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/**
 * @swagger
 * /api/device/create:
 *   post:
 *     summary: Tạo thiết bị mới
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idDevice:
 *                 type: string
 *                 example: device-123
 *               ipDevice:
 *                 type: string
 *                 example: 192.168.1.1
 *     responses:
 *       200:
 *         description: Tạo thiết bị thành công
 *       400:
 *         description: Thiếu thông tin
 *       500:
 *         description: Lỗi khi tạo thiết bị
 */
app.post('/create', async (req, res) => {
  const {idDevice, ipDevice} = req.body;

  // Kiểm tra xem thông tin có được cung cấp đầy đủ không
  if (!idDevice || !ipDevice) {
    return res.status(400).json({message: 'idDevice, ipDeviceare required'});
  }

  try {
    // Tạo thiết bị mới
    const newDevice = new Device({idDevice, ipDevice});
    await newDevice.save();

    return res
      .status(200)
      .json({message: 'Device created successfully!', device: newDevice});
  } catch (error) {
    return res.status(500).json({message: 'Error creating device', error});
  }
});

module.exports = app;
