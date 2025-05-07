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
      status: 500,
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
app.get('/membersDetail/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const userId = req.user.userId; // Lấy userId từ token

    const membersInfo = await Promise.all(
      device.members.map(async member => {
        const user = await User.findById(member.userId).select('name avatar');

        return {
          userId: member.userId, // Luôn trả về userId từ member
          name: user ? user.name : 'Unknown', // Nếu không có user, trả về 'Unknown'
          role: member.role,
          img:
            user && user.avatar
              ? user.avatar
              : 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg', // Trả về avatar mặc định nếu không có
          isMe: member.userId.toString() === userId.toString(), // So sánh
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
 * /api/device/blocksDetail/{id_esp}:
 *   get:
 *     summary: Lấy tất cả thông tin của blocks trong một Device
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: id_esp của Device
 *         schema:
 *           type: string
 *           example: "C1C93A7DBCC"
 *     responses:
 *       200:
 *         description: Danh sách thông tin của các user bị block (trả về dạng mảng)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   img:
 *                     type: string
 *                     example: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */

app.get('/blocksDetail/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp}).populate({
      path: 'blocks',
      select: 'name avatar',
    });

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const blocksInfo = device.blocks.map(user => ({
      userId: user._id,
      name: user.name || 'Unknown',
      img:
        user.avatar ||
        'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',
    }));
    res.status(200).json({message: 'Success', data: blocksInfo});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
  }
});

/**
 * @swagger
 * /api/device/addBlock/{id_esp}:
 *   post:
 *     summary: Thêm một user vào danh sách block của Device và xóa khỏi danh sách members
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: id_esp của Device
 *         schema:
 *           type: string
 *           example: "C1C93A7DBCC"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Thêm user vào danh sách block và xóa khỏi danh sách members thành công
 *       404:
 *         description: Device không tìm thấy hoặc user không hợp lệ
 *       400:
 *         description: User đã bị chặn trước đó
 *       500:
 *         description: Lỗi server
 */
app.post('/addBlock/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.body;
    const device = await Device.findOne({ id_esp: req.params.id_esp });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const user = await User.findById(userId); // Giả sử bạn có model User
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem user đã bị chặn chưa
    if (device.blocks.includes(userId)) {
      return res.status(400).json({ message: 'User is already blocked' });
    }

    // Kiểm tra xem user có trong danh sách members không
    const memberToRemove = device.members.find(member => member.userId.toString() === userId.toString());
    if (!memberToRemove) {
      return res.status(400).json({ message: 'User is not a member of this device' });
    }

    // Xóa user khỏi danh sách members (so sánh với member.userId)
    device.members = device.members.filter(
      member => member.userId.toString() !== userId.toString()
    );

    // Thêm user vào danh sách blocks
    device.blocks.push(userId);

    // Lưu lại thay đổi
    await device.save();

    res.status(200).json({
      message: 'User added to block list and removed from members successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
 * /api/device/delBlock/{id_esp}:
 *   delete:
 *     summary: Xóa một user khỏi danh sách block của Device
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: id_esp của Device
 *         schema:
 *           type: string
 *           example: "C1C93A7DBCC"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Xóa user khỏi danh sách block thành công
 *       404:
 *         description: Device không tìm thấy hoặc user không hợp lệ
 *       500:
 *         description: Lỗi server
 */
app.delete('/delBlock/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const {userId} = req.body;
    const device = await Device.findOne({id_esp: req.params.id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }
    if (!device.blocks.includes(userId)) {
      return res.status(404).json({message: 'User is not blockned'});
    }

    device.blocks = device.blocks.filter(block => block.toString() !== userId);
    await device.save();

    res
      .status(200)
      .json({message: 'User removed from block list successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
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
    const {id_esp} = req.params;
    const {role} = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    // Lọc thành viên không hợp lệ
    device.members = device.members.filter(m => m.userId);

    const isExist = device.members.some(m => m.userId.toString() === userId);
    if (isExist) {
      return res.status(400).json({message: 'Member already exists'});
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
      notice =
        'Owner already exists. Role changed to member and added successfully';
    }

    // Thêm user vào thiết bị
    device.members.push({userId, role: finalRole});

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

/**
 * @swagger
 * /api/device/leaveDevice/{id_esp}:
 *   delete:
 *     summary: User leaves the device
 *     description: Allows a user to leave a device, including the owner.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_esp
 *         in: path
 *         required: true
 *         description: ID of the device the user wants to leave
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully left the device
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully left the device
 *                 device:
 *                   type: object
 *                   description: The updated device object
 *       403:
 *         description: Forbidden - User is not a member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not a member of this device
 *       404:
 *         description: Not Found - User or Device not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Device not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
app.delete('/leaveDevice/:id_esp', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {id_esp} = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const currentUser = device.members.find(
      member => member.userId.toString() === userId.toString(),
    );

    if (!currentUser) {
      return res
        .status(403)
        .json({message: 'You are not a member of this device'});
    }

    device.members = device.members.filter(
      member => member.userId.toString() !== userId.toString(),
    );

    await device.save();

    await User.updateOne({_id: userId}, {$pull: {gardenId: id_esp}});

    return res
      .status(200)
      .json({message: 'Successfully left the device', device});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Server error'});
  }
});

/**
 * @swagger
 * /api/device/membersWithoutUserLogin/{id_esp}:
 *   get:
 *     summary: Get members of a device excluding the logged-in user
 *     description: Retrieves the list of device members except for the currently authenticated user.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_esp
 *         in: path
 *         required: true
 *         description: The device ID to retrieve members from.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members excluding logged-in user
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
 *                         description: ID of the member
 *                       name:
 *                         type: string
 *                         description: Name of the member
 *                       role:
 *                         type: string
 *                         description: Role of the member (e.g., member, owner)
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Device not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
app.get(
  '/membersWithoutUserLogin/:id_esp',
  authenticateJWT,
  async (req, res) => {
    try {
      const device = await Device.findOne({id_esp: req.params.id_esp});

      if (!device) {
        return res.status(404).json({message: 'Device not found'});
      }

      const filteredMembers = device.members.filter(
        member => member.userId.toString() !== req.user.userId,
      );

      const membersInfo = await Promise.all(
        filteredMembers.map(async member => {
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
  },
);

/**
 * @swagger
 * /api/device/userDevices:
 *   get:
 *     summary: Lấy danh sách tất cả thiết bị của người dùng
 *     description: Trả về danh sách các thiết bị mà người dùng hiện tại là thành viên, dựa trên userId từ token JWT.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thiết bị của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_esp:
 *                         type: string
 *                         example: "ESP123456"
 *                       name_area:
 *                         type: string
 *                         example: "Khu A"
 *                       create_at:
 *                         type: string
 *                         format: date-time
 *                       update_at:
 *                         type: string
 *                         format: date-time
 *                       sensors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               example: "moisture"
 *                             value:
 *                               type: number
 *                               example: 55
 *                       controls:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "Pump"
 *                             status:
 *                               type: boolean
 *                               example: true
 *                       members:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                               example: "60d5f9b7e1d4a029c8dcb123"
 *                             role:
 *                               type: string
 *                               example: "owner"
 *                       img_area:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dzgvy2rlt/image/upload/v1744970883/uploads/example.jpg"
 *       404:
 *         description: Không tìm thấy thiết bị nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No devices found for this user"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error retrieving devices"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
app.get('/userDevices', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Tìm tất cả thiết bị mà userId nằm trong mảng members
    const devices = await Device.find({'members.userId': userId});

    if (!devices || devices.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No devices found for this user',
      });
    }

    // Xử lý dữ liệu để thêm trường isCurrentUser vào members
    const processedDevices = devices.map(device => {
      const deviceObj = device.toObject();
      deviceObj.members = deviceObj.members.map(member => {
        return {
          ...member,
          isCurrentUser: member.userId.toString() === userId,
        };
      });
      return deviceObj;
    });

    res.status(200).json({
      status: 200,
      data: processedDevices,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error retrieving devices',
      error: error.message,
    });
  }
});

module.exports = app;
