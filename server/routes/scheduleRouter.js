const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Device = require('../models/deviceModel');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/schedule/scheduleBy/{id_esp}:
 *   get:
 *     summary: Lấy danh sách thành viên của thiết bị
 *     tags: [Schedules]
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
app.get('/scheduleBy/:id_esp', async (req, res) => {
  try {
    const device = await Device.findOne({id_esp: req.params.id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    // Kiểm tra xem có ít nhất một control không
    if (device.controls.length === 0) {
      return res.status(404).json({message: 'No controls found'});
    }

    // Lấy tất cả lịch trình từ tất cả controls
    const allSchedules = device.controls.flatMap(control => control.schedules);

    res.status(200).json({data: allSchedules});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving schedules', error: error.message});
  }
});

/**
 * @swagger
 * /api/schedule/scheduleBy/{id_esp}/{name}:
 *   get:
 *     summary: Lấy danh sách lịch trình theo thiết bị và tên điều khiển
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị (ESP)
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: name
 *         required: true
 *         description: Tên của control (water, light, wind)
 *         schema:
 *           type: string
 *           enum: [water, light, wind]
 *     responses:
 *       200:
 *         description: Lấy lịch trình thành công
 *       404:
 *         description: Không tìm thấy thiết bị hoặc control
 *       500:
 *         description: Lỗi server
 */
app.get('/scheduleBy/:id_esp/:name', async (req, res) => {
  const {id_esp, name} = req.params;

  try {
    const device = await Device.findOne({id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    // Tìm control theo tên
    const control = device.controls.find(c => c.name === name);

    if (!control) {
      return res.status(404).json({message: `Control '${name}' not found`});
    }
    if (!control.schedules || control.schedules.length === 0) {
      return res
        .status(200)
        .json({message: `No schedules found for control '${name}'`, data: []});
    }

    res.status(200).json({data: control.schedules});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving schedules', error: error.message});
  }
});

/**
 * @swagger
 * /api/schedule/addSchedule/{id_esp}/{name}:
 *   post:
 *     summary: Thêm lịch trình vào thiết bị theo tên control
 *     description: Thêm một lịch trình mới vào thiết bị dựa trên `id_esp` và `controlName`.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị *
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: name
 *         required: true
 *         description: Tên của control trong danh sách controls *
 *         schema:
 *           type: string
 *           enum: ["water", "light", "wind"]
 *           example: "water"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Trạng thái bật/tắt *
 *                 example: false
 *               startTime:
 *                 type: string
 *                 pattern: "^((0[1-9])|(1[0-2])):([0-5]\\d)\\s?(AM|PM)$"
 *                 description: Giờ bắt đầu theo định dạng giờ phút AM/PM *
 *                 example: "10:30 AM"
 *               duration:
 *                 type: number
 *                 description: Thời lượng hoạt động (phút) *
 *                 example: 60
 *               repeat:
 *                 type: array
 *                 description: Các ngày lặp lại trong tuần *
 *                 items:
 *                   type: string
 *                   enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
 *                   example: "Monday"
 *             required:
 *               - status
 *               - startTime
 *               - duration
 *               - repeat
 *     responses:
 *       200:
 *         description: Lịch trình được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule added successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: boolean
 *                         example: false
 *                       startTime:
 *                         type: string
 *                         example: "10:30 AM"
 *                       duration:
 *                         type: number
 *                         example: 60
 *                       repeat:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
 *                           example: "Monday"
 *       404:
 *         description: Không tìm thấy thiết bị hoặc control
 *       500:
 *         description: Lỗi khi thêm lịch trình
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding schedule"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message here"
 */
app.post('/addSchedule/:id_esp/:name', async (req, res) => {
  try {
    const {status, startTime, duration, repeat} = req.body;
    const {id_esp, name} = req.params;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    // Tìm control theo tên (không phải ID)
    const control = device.controls.find(ctrl => ctrl.name === name);
    if (!control) {
      return res.status(404).json({message: 'Control not found'});
    }

    // Thêm schedule mới vào control
    control.schedules.push({status, startTime, duration, repeat});

    await device.save();

    res.status(200).json({
      message: 'Schedule added successfully',
      data: control.schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding schedule',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/schedule/updateSchedule/{id_esp}/{scheduleId}:
 *   put:
 *     summary: Cập nhật lịch trình theo ID thiết bị
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         description: ID của lịch trình cần cập nhật
 *         schema:
 *           type: string
 *           example: "67ef8bcc8dcbba7140073245"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *               startTime:
 *                 type: string
 *                 pattern: "^((0[1-9])|(1[0-2])):([0-5]\\d)\\s?(AM|PM)$"
 *                 description: Giờ bắt đầu theo định dạng giờ phút AM/PM *
 *                 example: "10:30 AM"
 *               duration:
 *                 type: number
 *                 example: 120
 *               repeat:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
 *                   example: "Monday"
 *     responses:
 *       200:
 *         description: Cập nhật lịch trình thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                     startTime:
 *                       type: string
 *                     duration:
 *                       type: number
 *                     repeat:
 *                       type: array
 *       404:
 *         description: Thiết bị hoặc lịch trình không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
app.put('/updateSchedule/:id_esp/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { status, startTime, duration, repeat } = req.body;

    const device = await Device.findOne({ id_esp: req.params.id_esp });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Duyệt qua tất cả các control
    let found = false;
    let updatedSchedule = null;

    for (const control of device.controls) {
      const scheduleIndex = control.schedules.findIndex(
        s => s._id.toString() === scheduleId
      );

      if (scheduleIndex !== -1) {
        // Cập nhật thông tin nếu tìm thấy lịch trình
        if (status !== undefined) control.schedules[scheduleIndex].status = status;
        if (startTime) control.schedules[scheduleIndex].startTime = startTime;
        if (duration) control.schedules[scheduleIndex].duration = duration;
        if (repeat) control.schedules[scheduleIndex].repeat = repeat;

        updatedSchedule = control.schedules[scheduleIndex];
        found = true;
        break; // Dừng vòng lặp sau khi cập nhật
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await device.save();

    res.status(200).json({
      message: 'Schedule updated successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
});


/**
 * @swagger
 * /api/schedule/delSchedule/{id_esp}/{scheduleId}:
 *   delete:
 *     summary: Xóa lịch trình khỏi thiết bị
 *     description: Xóa một lịch trình khỏi thiết bị theo `id_esp`.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         description: ID của lịch trình cần xóa
 *         schema:
 *           type: string
 *           example: "67ef8bcc8dcbba7140073245"
 *     responses:
 *       200:
 *         description: Lịch trình đã được xóa thành công
 *       404:
 *         description: Thiết bị hoặc lịch trình không tìm thấy
 *       500:
 *         description: Lỗi khi xóa lịch trình
 */
app.delete('/delSchedule/:id_esp/:scheduleId', async (req, res) => {
  try {
    const {id_esp, scheduleId} = req.params;

    const device = await Device.findOne({id_esp});

    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    let scheduleFound = false;
    for (const control of device.controls) {
      const scheduleIndex = control.schedules.findIndex(
        s => s._id.toString() === scheduleId,
      );

      if (scheduleIndex !== -1) {
        control.schedules.splice(scheduleIndex, 1);
        scheduleFound = true;
        break;
      }
    }

    if (!scheduleFound) {
      return res.status(404).json({message: 'Schedule not found'});
    }

    await device.save();

    res.status(200).json({
      message: 'Schedule removed successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error removing schedule', error: error.message});
  }
});

module.exports = app;
