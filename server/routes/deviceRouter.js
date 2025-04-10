const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');
const User = require('../models/userModel');

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
 * /api/device/membersBy/{id_esp}:
 *   get:
 *     summary: Lấy danh sách thành viên của thiết bị
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *     responses:
 *       200:
 *         description: List of members retrieved successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error retrieving members
 */
app.get('/membersBy/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }
    res.status(200).json({data: device.members});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving members', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/createDevice:
 *   post:
 *     summary: Tạo thiết bị mới hoặc cập nhật nếu id đã tồn tại
 *     description: Tạo một thiết bị mới hoặc cập nhật thiết bị hiện có dựa trên id_esp, ngoại trừ trường members.
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
 *                 example: "ESP123"
 *               name_area:
 *                 type: string
 *                 example: "Khu A"
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["moisture","luminosity","rain","temperature","humidity","stream"]
 *                       example: "moisture"
 *                     value:
 *                       type: number
 *                       example: 55
 *               controls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Pump"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     threshold_min:
 *                       type: number
 *                       example: 30
 *                     threshold_max:
 *                       type: number
 *                       example: 70
 *                     mode:
 *                       type: string
 *                       enum: ["manual", "threshold", "schedule" ]
 *                       example: "manual"
 *                     schedules:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           schedule_time:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-03-21T10:00:00Z"
 *     responses:
 *       201:
 *         description: Device created/updated successfully
 *       500:
 *         description: Error processing device
 */
app.post('/createDevice', async (req, res) => {
  try {
    const {id_esp, name_area, sensors, controls} = req.body;
    let device = await Device.findOne({id_esp});

    if (!device) {
      // Nếu thiết bị chưa tồn tại, tạo mới luôn
      device = new Device({
        id_esp,
        name_area,
        create_at: Date.now(),
        sensors,
        controls,
      });
    } else {
      // Cập nhật thông tin cơ bản
      device.name_area = name_area;
      (device.update_at = Date.now()), (device.sensors = sensors);
      device.controls = controls;
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
 * /api/device/addMember/{id_esp}:
 *   post:
 *     summary: Thêm thành viên vào thiết bị
 *     description: Thêm một thành viên vào thiết bị theo `id_esp`, kiểm tra nếu thành viên đã tồn tại và phân quyền "owner" hoặc "member".
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5f9b7e1d4a029c8dcb123"
 *               role:
 *                 type: string
 *                 enum: ["owner", "member"]
 *                 example: "member"
 *             required:
 *               - userId
 *               - role
 *     responses:
 *       200:
 *         description: Thành viên được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member added successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "60d5f9b7e1d4a029c8dcb123"
 *                       role:
 *                         type: string
 *                         enum: ["owner", "member"]
 *                         example: "member"
 *       400:
 *         description: Thành viên đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member already exists"
 *       404:
 *         description: Không tìm thấy thiết bị
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Device not found"
 *       500:
 *         description: Lỗi khi thêm thành viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding member"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message here"
 */
app.post('/addMember/:id_esp', async (req, res) => {
  try {
    const {userId, role} = req.body;

    // Kiểm tra xem userId có tồn tại trong cơ sở dữ liệu không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const device = await Device.findOne({id_esp: req.params.id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const isExist = device.members.some(m => m.userId.toString() === userId);
    if (isExist) {
      return res.status(400).json({message: 'Member already exists'});
    }

    const ownerExists = device.members.some(m => m.role === 'owner');
    if (role === 'owner' && ownerExists) {
      return res
        .status(400)
        .json({message: 'An owner already exists for this device'});
    }

    const newRole = role === 'owner' ? 'owner' : 'member'; // Đảm bảo role luôn hợp lý

    // Thêm thành viên vào thiết bị
    device.members.push({userId, role: newRole});
    if (!user.gardenId.includes(req.params.id_esp)) {
      user.gardenId.push(req.params.id_esp);
    }

    await device.save();
    await user.save();

    res.status(200).json({
      message: 'Member added successfully',
      data: {
        members: device.members, // Thành viên của thiết bị
        gardenId: user.gardenId, // gardenId đã được cập nhật của người dùng
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error adding member', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/updateDevice/{id_esp}:
 *   put:
 *     summary: Cập nhật thông tin thiết bị theo id_esp
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_area:
 *                 type: string
 *                 example: "Khu A"
 *               time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-21T10:00:00Z"
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["moisture", "luminosity", "rain", "temperature", "humidity", "stream"]
 *                       example: "moisture"
 *                     value:
 *                       type: number
 *                       example: 55
 *               controls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Pump"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     threshold_min:
 *                       type: number
 *                       example: 30
 *                     threshold_max:
 *                       type: number
 *                       example: 70
 *                     mode:
 *                       type: string
 *                       enum: ["manual", "threshold", "schedule"]
 *                       example: "manual"
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error updating device
 */
app.put('/updateDevice/:id_esp', async (req, res) => {
  try {
    const {name_area, sensors, controls} = req.body;
    const device = await Device.findOne({id_esp: req.params.id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    device.name_area = name_area || device.name_area;
    device.update_at = Date.now();
    device.sensors = sensors || device.sensors;
    device.controls = controls || device.controls;

    await device.save();
    res
      .status(200)
      .json({message: 'Device updated successfully', data: device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating device', error: error.message});
  }
});

/**
 * @swagger
 * /api/device/delMember/{id_esp}:
 *   delete:
 *     summary: Xóa thành viên khỏi thiết bị
 *     description: Xóa một thành viên khỏi thiết bị theo `id_esp`.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID của người dùng cần xóa
 *         schema:
 *           type: string
 *           example: "60d5f9b7e1d4a029c8dcb123"
 *     responses:
 *       200:
 *         description: Thành viên đã được xóa thành công
 *       404:
 *         description: Thiết bị hoặc thành viên không tìm thấy
 *       500:
 *         description: Lỗi khi xóa thành viên
 */
app.delete('/delMember/:id_esp', async (req, res) => {
  try {
    const {userId} = req.query;
    const device = await Device.findOne({id_esp: req.params.id_esp});
    const user = await User.findById(userId);
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const memberIndex = device.members.findIndex(
      m => m.userId.toString() === userId,
    );

    if (memberIndex === -1) {
      return res.status(404).json({message: 'Member not found'});
    }

    // Xóa thành viên
    device.members.splice(memberIndex, 1);
    user.gardenId.splice(req.params.id_esp);
    await device.save();
    await user.save();

    res.status(200).json({
      message: 'Member removed successfully',
      data: {
        members: device.members,
        gardenId: user.gardenId,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error removing member', error: error.message});
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
    const device = await Device.findOneAndDelete({id_esp: req.params.id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }
    res
      .status(200)
      .json({message: 'Device deleted successfully', data: device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error deleting device', error: error.message});
  }
});

module.exports = app;
