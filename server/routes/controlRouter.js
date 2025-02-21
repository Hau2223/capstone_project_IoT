const express = require('express');
const Control = require('../models/controlModel');
const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const Sensor = require('../models/sensorModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/control/create:
 *   post:
 *     summary: Tạo bản ghi điều khiển
 *     tags: [Control]
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
 *               idUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: user-123
 *     responses:
 *       200:
 *         description: Tạo bản ghi điều khiển thành công
 *       400:
 *         description: Thiếu thông tin
 *       409:
 *         description: Bản ghi đã tồn tại
 *       500:
 *         description: Lỗi khi tạo bản ghi
 */
app.post('/create', async (req, res) => {
  const {idDevice, idUsers} = req.body;

  // Kiểm tra xem thông tin có được cung cấp đầy đủ không
  if (
    !idDevice ||
    !idUsers ||
    !Array.isArray(idUsers) ||
    idUsers.length === 0
  ) {
    return res.status(400).json({message: 'idDevice and idUsers are required'});
  }

  try {
    // Kiểm tra xem bản ghi đã tồn tại chưa
    const existingControlRecord = await Control.findOne({id_Device: idDevice});

    if (existingControlRecord) {
      // Nếu bản ghi đã tồn tại, kiểm tra xem idUsers đã có chưa
      const newUsers = idUsers.filter(
        user => !existingControlRecord.id_User.includes(user),
      );
      if (newUsers.length === 0) {
        return res
          .status(409)
          .json({message: 'Control record already exists for these users'});
      }

      // Cập nhật danh sách người dùng
      existingControlRecord.id_User.push(...newUsers);
      await existingControlRecord.save();
      return res
        .status(200)
        .json({message: 'Control record updated successfully!'});
    }

    // Tạo bản ghi mới trong Control schema
    const controlRecord = new Control({id_User: idUsers, id_Device: idDevice});
    await controlRecord.save();

    return res
      .status(200)
      .json({message: 'Control record created successfully!'});
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Error creating control record', error});
  }
});

/**
 * @swagger
 * /api/control/active/{userId}/{deviceId}:
 *   post:
 *     summary: Điều khiển thiết bị
 *     tags: [Control]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: 67b7eed866da6b0cd1a3f9d4
 *       - name: deviceId
 *         in: path
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: device-123
 *     responses:
 *       200:
 *         description: Điều khiển thành công
 *       403:
 *         description: Người dùng không có quyền điều khiển thiết bị
 *       404:
 *         description: Không tìm thấy thiết bị hoặc người dùng
 *       500:
 *         description: Lỗi khi điều khiển thiết bị
 */
app.post('/active/:userId/:deviceId', async (req, res) => {
  const {userId, deviceId} = req.params;

  try {
    // Kiểm tra xem người dùng có tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Kiểm tra xem thiết bị có tồn tại
    const device = await Device.findOne({idDevice: deviceId});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    // Kiểm tra xem người dùng có quyền điều khiển thiết bị không
    const controlRecord = await Control.findOne({id_Device: deviceId});
    if (!controlRecord || !controlRecord.id_User.includes(userId)) {
      return res
        .status(403)
        .json({
          message: 'User does not have permission to control this device',
        });
    }

    device.active = !device.active;
    await device.save();

    // Cập nhật sensor control properties
    const sensors = await Sensor.find({idDevice: deviceId});
    sensors.forEach(sensor => {
      sensor.updateControl(device.active);
      sensor.save();
    });

    res.status(200).json({
      message: 'Device activation status toggled successfully',
      device,
      sensors,
    });
  } catch (error) {
    res.status(500).json({message: 'Error activating device', error});
  }
});
module.exports = app;
