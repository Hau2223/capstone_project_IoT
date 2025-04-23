const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const upload = require('../middlewares/cloudinaryUpload');
const authenticateJWT = require('../middlewares/authMiddleware');

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
    res.status(200).json({status: 200, data: devices});
  } catch (error) {
    res.status(500).json({
      status: 200,
      message: 'Error retrieving devices',
      error: error.message,
    });
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
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
app.get('/membersDetail/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const membersInfo = await Promise.all(
      device.members.map(async member => {
        const user = await User.findById(member.userId);

        return {
          userId: user ? user._id : member.userId,
          name: user ? user.name : 'Unknown',
          role: member.role,
        };
      }),
    );
    res.json({members: membersInfo});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
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
    res.status(200).json({
      status: 200,
      message: 'Device created/updated successfully',
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error processing device',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/device/addMember/{id_esp}:
 *   post:
 *     summary: Thêm thành viên vào thiết bị
 *     description: Thêm người dùng hiện tại với vai trò "owner" hoặc "member" vào thiết bị theo `id_esp`. `userId` được lấy từ token.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *                 enum: ["owner", "member"]
 *                 example: "member"
 *     responses:
 *       200:
 *         description: Thêm thành viên thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thành viên đã tồn tại
 *       404:
 *         description: Không tìm thấy người dùng hoặc thiết bị
 *       500:
 *         description: Lỗi máy chủ
 */
app.post('/addMember/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const { id_esp } = req.params;
    const { role } = req.body;
    const userId = req.user.userId; // lấy từ token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const device = await Device.findOne({ id_esp });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Lọc thành viên không hợp lệ
    device.members = device.members.filter(m => m.userId);

    const isExist = device.members.some(m => m.userId.toString() === userId);
    if (isExist) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    const ownerExists = device.members.some(m => m.role === 'owner');
    let finalRole = role || 'member';
    let notice = 'Member added successfully';

    // Nếu thiết bị chưa có thành viên nào → thêm đầu tiên là owner
    if (device.members.length === 0) {
      finalRole = 'owner';
      notice = 'First member added as owner';
    } else if (finalRole === 'owner' && ownerExists) {
      finalRole = 'member';
      notice = 'Owner already exists. Role changed to member and added successfully';
    }

    // Thêm user vào thiết bị
    device.members.push({ userId, role: finalRole });

    // Thêm id_esp vào gardenId của user nếu chưa có
    if (!user.gardenId.includes(id_esp)) {
      user.gardenId.push(id_esp);
    }

    await Promise.all([device.save(), user.save()]);

    return res.status(200).json({
      status: 200,
      message: notice,
      data: {
        members: device.members,
        gardenId: user.gardenId,
      },
    });
  } catch (error) {
    console.error('Error adding member:', error);
    return res.status(500).json({
      status: 500,
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
    res.status(200).json({
      status: 200,
      message: 'Device updated successfully',
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error updating device',
      error: error.message,
    });
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
    const {id_esp} = req.params;
    const {name_area} = req.body;

    const device = await Device.findOne({id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    device.name_area = name_area;
    await device.save();

    res.status(200).json({
      status: 200,
      message: 'Garden name updated successfully',
      data: {
        id_esp: device.id_esp,
        name_area: device.name_area,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error updating garden name',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/device/updateMember/{id_esp}/{userId}:
 *   put:
 *     summary: Promote a member to owner by id_esp and userId
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         schema:
 *           type: string
 *         required: true
 *         description: The ESP ID of the device
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The userId of the member to be promoted to owner
 *     responses:
 *       200:
 *         description: Successfully updated member to owner
 *       404:
 *         description: Device or user not found
 *       500:
 *         description: Internal server error
 */
app.put('/updateMember/:id_esp/:userId', async (req, res) => {
  const {id_esp, userId} = req.params;
  try {
    // 1. Find the device
    const device = await Device.findOne({id_esp});
    if (!device) return res.status(404).json({message: 'Device not found'});

    // 2. Check if the user is already a member
    const memberIndex = device.members.findIndex(
      m => m.userId.toString() === userId.toString(),
    );
    if (memberIndex === -1) {
      return res.status(404).json({message: 'User not found in members list'});
    }

    // 3. Demote any other owner to member
    device.members = device.members.map((m, i) => ({
      ...m.toObject(),
      role: i === memberIndex ? 'owner' : 'member',
    }));

    await device.save();

    res.status(200).json({
      message: 'User promoted to owner successfully',
      members: device.members,
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({message: 'Internal server error'});
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
    const {id_esp, userId} = req.params;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const memberIndex = device.members.findIndex(
      m => m.userId.toString() === userId,
    );
    if (memberIndex === -1) {
      return res.status(404).json({message: 'Member not found'});
    }

    // Remove member from device
    device.members.splice(memberIndex, 1);

    // Remove device ID from user's gardenId
    user.gardenId = user.gardenId.filter(gId => gId !== id_esp);

    await Promise.all([device.save(), user.save()]);

    res.status(200).json({
      status: 200,
      message: 'Member removed successfully',
      data: {
        members: device.members,
        gardenId: user.gardenId,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
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
    res.status(200).json({
      status: 200,
      message: 'Device deleted successfully',
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error deleting device',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/device/upload-img/{id_esp}:
 *   put:
 *     summary: Upload hoặc cập nhật hình ảnh khu vực (img_area) cho thiết bị theo id_esp
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã id_esp của thiết bị
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img_area:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện khu vực thiết bị (tối đa 5MB)
 *     responses:
 *       200:
 *         description: Cập nhật ảnh thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Device image updated"
 *               img_area: "https://res.cloudinary.com/dzgvy2rlt/image/upload/v1744970883/uploads/example.jpg"
 *       400:
 *         description: Lỗi khi không có ảnh hoặc quá dung lượng
 *       404:
 *         description: Không tìm thấy thiết bị
 *       500:
 *         description: Lỗi server
 */
app.put('/upload-img/:id_esp', upload.single('img_area'), async (req, res) => {
  try {
    const {id_esp} = req.params;

    if (!req.file || !req.file.path) {
      return res.status(400).json({message: 'No image uploaded'});
    }
    // Cập nhật link ảnh mới vào DB
    const updatedDevice = await Device.findOneAndUpdate(
      {id_esp},
      {img_area: req.file.path},
      {new: true},
    );

    if (!updatedDevice) {
      return res.status(404).json({message: 'Device not found'});
    }

    res.status(200).json({
      status: 200,
      message: 'Device image updated',
      img_area: updatedDevice.img_area,
    });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({status: 400, message: 'Ảnh vượt quá dung lượng tối đa 2MB'});
    }
    res.status(500).json({
      status: 500,
      message: 'Error uploading image for device',
      error: err.message,
    });
  }
});

module.exports = app;
