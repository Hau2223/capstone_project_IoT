const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/**
 * @swagger
 * /api/device/detailDevice:
 *   get:
 *     summary: Lấy danh sách các thiết bị hiện có
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of all devices
 *       500:
 *         description: Error retrieving devices
 */
app.get('/detailDevice', async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json({data: devices});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving devices', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/detailDeviceBy/{id_esp}:
 *   get:
 *     summary: Lấy thông tin thiết bị theo id_esp
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         schema:
 *           type: string
 *         example: "ESP123456"
 *     responses:
 *       200:
 *         description: Device data retrieved successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error retrieving device
 */
app.get('/detailDeviceBy/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }
    res.status(200).json({data: device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving device', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/createDevice:
 *   post:
 *     summary: Tạo thiết bị mới hoặc cập nhật nếu id đã tồn tại
 *     description: Creates a new device or updates an existing one based on id_esp.
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_esp:
 *                 type: string
 *                 example: "ESP123456"
 *               time:
 *                 type: string
 *                 example: "2025-03-21T10:00:00Z"
 *               status:
 *                 type: boolean
 *                 example: true
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb123"
 *                     role:
 *                       type: string
 *                       enum: ["owner", "member"]
 *                       example: "member"
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sensorId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb456"
 *               controls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     controlId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb789"
 *     responses:
 *       201:
 *         description: Device created/updated successfully
 *       500:
 *         description: Error processing device
 */
app.post('/createDevice', async (req, res) => {
  try {
    const {id_esp, time, status, members, sensors, controls} = req.body;

    let device = await Device.findOne({id_esp});

    if (!device) {
      // Nếu thiết bị chưa tồn tại, tạo mới luôn
      let uniqueMembers = [];
      let ownerExists = false;

      members.forEach(member => {
        if (!uniqueMembers.some(m => m.userId === member.userId)) {
          if (member.role === 'owner') {
            if (ownerExists) {
              member.role = 'member'; // Nếu đã có owner, đổi thành member
            } else {
              ownerExists = true; // Đánh dấu rằng đã có owner
            }
          }
          uniqueMembers.push(member);
        }
      });

      const uniqueSensors = sensors.filter(
        (sensor, index, self) =>
          index === self.findIndex(s => s.sensorId === sensor.sensorId),
      );

      const uniqueControls = controls.filter(
        (control, index, self) =>
          index === self.findIndex(c => c.controlId === control.controlId),
      );

      device = new Device({
        id_esp,
        time,
        status,
        members: uniqueMembers,
        sensors: uniqueSensors,
        controls: uniqueControls,
      });
    } else {
      // Cập nhật thông tin cơ bản
      device.time = time;
      device.status = status;

      let ownerExists = device.members.some(m => m.role === 'owner');

      members.forEach(member => {
        if (!device.members.some(m => m.userId === member.userId)) {
          if (member.role === 'owner') {
            if (ownerExists) {
              member.role = 'member'; // Chuyển thành member nếu đã có owner
            } else {
              ownerExists = true;
            }
          }
          device.members.push(member);
        }
      });

      // Loại bỏ sensors trùng lặp
      device.sensors = [
        ...new Map(
          [...device.sensors, ...sensors].map(s => [s.sensorId, s]),
        ).values(),
      ];
      // Loại bỏ controls trùng lặp
      device.controls = [
        ...new Map(
          [...device.controls, ...controls].map(c => [c.controlId, c]),
        ).values(),
      ];
    }
    await device.save();
    res
      .status(200)
      .json({message: 'Device created/updated successfully', data: device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error processing device', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/updateDeviceBy/{id_esp}:
 *   put:
 *     summary: Cập nhật dữ liệu thiết bị theo id_esp
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         schema:
 *           type: string
 *         example: "ESP123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: string
 *                 example: "2025-03-21T10:00:00Z"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error updating device
 */
app.put('/updateDeviceBy/:id_esp', async (req, res) => {
  try {
    const {time, status, members, sensors, controls} = req.body;
    let device = await Device.findOne({id_esp: req.params.id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    device.time = time || device.time;
    device.status = status !== undefined ? status : device.status;

    if (members) {
      let ownerExists = device.members.some(m => m.role === 'owner');
      members.forEach(member => {
        if (!device.members.some(m => m.userId.toString() === member.userId)) {
          if (member.role === 'owner' && ownerExists) {
            member.role = 'member';
          } else if (member.role === 'owner') {
            ownerExists = true;
          }
          device.members.push(member);
        }
      });
    }

    if (sensors) {
      device.sensors = [
        ...new Map(
          [...device.sensors, ...sensors].map(s => [s.sensorId, s]),
        ).values(),
      ];
    }

    if (controls) {
      device.controls = [
        ...new Map(
          [...device.controls, ...controls].map(c => [c.controlId, c]),
        ).values(),
      ];
    }

    await device.save();
    res.status(200).json({message: 'Device updated successfully', data: device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating device', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/delDeviceBy/{id_esp}:
 *   delete:
 *     summary: Xóa dữ liệu thiết bị theo id_esp
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         schema:
 *           type: string
 *         example: "ESP123456"
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error deleting device
 */
app.delete('/delDeviceBy/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ id_esp: req.params.id_esp });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json({ message: 'Device deleted successfully', data: device});
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
});

module.exports = app;
