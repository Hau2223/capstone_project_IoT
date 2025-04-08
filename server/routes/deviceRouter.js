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
 * /api/device/membersDetail/{id_esp}:
 *   get:
 *     summary: Lấy tất cả tên của members trong một Device
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: id_esp của Device
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *     responses:
 *       200:
 *         description: Danh sách tên của members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 names:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
app.get('/membersDetail/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOne({ id_esp: req.params.id_esp });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    const membersInfo = await Promise.all(
      device.members.map(async (member) => {
        const user = await User.findById(member.userId);
        return {
          name: user ? user.name : 'Unknown',
          role: member.role,
        };
      })
    );

    // Trả về tên và role của các User
    res.json({ members: membersInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
 *     description: Thêm một thành viên với vai trò "owner" hoặc "member" vào thiết bị theo `id_esp`.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID of the device
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5f9b7e1d4a029c8dcb123"
 *               role:
 *                 type: string
 *                 enum: ["owner", "member"]
 *                 example: "member"
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: Invalid input or member already exists
 *       404:
 *         description: User or device not found
 *       500:
 *         description: Internal server error
 */
app.post('/addMember/:id_esp', async (req, res) => {
  try {
    const { id_esp } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'userId and role are required' });
    }

    if (!['owner', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const device = await Device.findOne({ id_esp });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Clean invalid members
    device.members = device.members.filter(m => m.userId);

    const isExist = device.members.some(m => m.userId.toString() === userId);
    if (isExist) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    // Kiểm tra xem đã có owner chưa
    const ownerExists = device.members.some(m => m.role === 'owner');
    let finalRole = role;

    let notice = 'Member added successfully';

    if (role === 'owner' && ownerExists) {
      // Nếu đã có owner, chuyển role về member
      finalRole = 'member';
      notice = 'Owner already exists. Role changed to member and added successfully';
    }

    // Thêm user vào thiết bị với role đã xác định
    device.members.push({ userId, role: finalRole });

    // Thêm id_esp vào gardenId của user nếu chưa có
    if (!user.gardenId.includes(id_esp)) {
      user.gardenId.push(id_esp);
    }

    await Promise.all([device.save(), user.save()]);

    return res.status(200).json({
      message: notice,
      data: {
        members: device.members,
        gardenId: user.gardenId,
      },
    });
  } catch (error) {
    console.error('Error adding member:', error);
    return res.status(500).json({
      message: 'Failed to add member',
      error: error.message,
    });
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
 * /api/device/updateName/{id_esp}:
 *   patch:
 *     summary: Cập nhật tên khu vườn
 *     description: Cập nhật trường `name_area` của thiết bị dựa trên `id_esp`.
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID of the device (ESP)
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
 *                 example: "My Beautiful Garden"
 *     responses:
 *       200:
 *         description: Garden name updated successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Error updating garden name
 */
app.patch('/updateName/:id_esp', async (req, res) => {
  try {
    const { id_esp } = req.params;
    const { name_area } = req.body;

    const device = await Device.findOne({ id_esp });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.name_area = name_area;
    await device.save();

    res.status(200).json({
      message: 'Garden name updated successfully',
      data: {
        id_esp: device.id_esp,
        name_area: device.name_area,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating garden name',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/device/delMember/{id_esp}/{userId}:
 *   delete:
 *     summary: Remove a member from a device
 *     description: Remove a member from the device by `id_esp` and `userId`.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID of the device
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to be removed
 *         schema:
 *           type: string
 *           example: "60d5f9b7e1d4a029c8dcb123"
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       404:
 *         description: Device, user, or member not found
 *       500:
 *         description: Error removing member
 */
app.delete('/delMember/:id_esp/:userId', async (req, res) => {
  try {
    const { id_esp, userId } = req.params;

    const device = await Device.findOne({ id_esp });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const memberIndex = device.members.findIndex(
      m => m.userId.toString() === userId,
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Remove member from device
    device.members.splice(memberIndex, 1);

    // Remove device ID from user's gardenId
    user.gardenId = user.gardenId.filter(gId => gId !== id_esp);

    await Promise.all([device.save(), user.save()]);

    res.status(200).json({
      message: 'Member removed successfully',
      data: {
        members: device.members,
        gardenId: user.gardenId,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error removing member',
      error: error.message,
    });
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