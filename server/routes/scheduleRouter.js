const express = require('express');
const Schedule = require('../models/scheduleModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
/**
* @swagger
 * /api/schedule/detailScheduleBy:
 *   get:
 *     summary: Chi tiết lịch biểu theo ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch biểu
 *     responses:
 *       200:
 *         description: Trả về chi tiết lịch biểu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *             examples:
 *               scheduleDetail:
 *                 summary: Chi tiết lịch biểu
 *                 value:
 *                   _id: "60d5ecb54b6cf82de4d7a8c1"
 *                   status: true
 *                   startTime: "2024-03-25T10:30:00Z"
 *                   duration: 3600
 *                   repeat: ["Monday", "Wednesday", "Friday"]
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid schedule ID"
 *       404:
 *         description: Không tìm thấy lịch biểu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
app.get('/detailScheduleBy', async (req, res) => {
    try {
        const { id } = req.query;
        // Kiểm tra nếu ID không hợp lệ
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        const schedule = await Schedule.findById(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedule/createSchedule:
 *   post:
 *     summary: Tạo lịch biểu mới
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *           examples:
 *             fullSchedule:
 *               summary: Ví dụ lịch biểu đầy đủ
 *               value:
 *                 status: true
 *                 startTime: "2024-03-25T10:30:00Z"
 *                 duration: 3600
 *                 repeat: ["Monday", "Wednesday", "Friday"]
 *             defaultSchedule:
 *               summary: Ví dụ lịch biểu mặc định
 *               value:
 *                 startTime: "2024-03-25T10:30:00Z"
 *                 duration: 1800
 *                 repeat: ["Tuesday", "Thursday"]
 *     responses:
 *       201:
 *         description: Tạo lịch biểu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *             examples:
 *               successResponse:
 *                 summary: Kết quả tạo lịch biểu thành công
 *                 value:
 *                   _id: "60d5ecb54b6cf82de4d7a8c1"
 *                   status: true
 *                   startTime: "2024-03-25T10:30:00Z"
 *                   duration: 3600
 *                   repeat: ["Monday", "Wednesday", "Friday"]
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Required fields are missing"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

app.post('/createSchedule', async (req, res) => {
    try {
        const { status, startTime, duration, repeat } = req.body;
        if (!startTime || !duration || !repeat) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        const schedule = new Schedule({
            status: status || false,
            startTime,
            duration,
            repeat
        });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* @swagger
* /api/schedule/updateSchedule/{id}:
 *   put:
 *     summary: Cập nhật lịch biểu
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch biểu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *           examples:
 *             updateFullSchedule:
 *               summary: Ví dụ cập nhật lịch biểu đầy đủ
 *               value:
 *                 status: true
 *                 startTime: "2024-03-26T14:45:00Z"
 *                 duration: 7200
 *                 repeat: ["Friday", "Saturday"]
 *             updatePartialSchedule:
 *               summary: Ví dụ cập nhật một phần lịch biểu
 *               value:
 *                 startTime: "2024-03-26T15:00:00Z"
 *                 duration: 5400
 *                 repeat: ["Monday", "Wednesday"]
 *     responses:
 *       200:
 *         description: Cập nhật lịch biểu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *             examples:
 *               successResponse:
 *                 summary: Kết quả cập nhật lịch biểu
 *                 value:
 *                   _id: "60d5ecb54b6cf82de4d7a8c1"
 *                   status: true
 *                   startTime: "2024-03-26T14:45:00Z"
 *                   duration: 7200
 *                   repeat: ["Friday", "Saturday"]
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Required fields are missing"
 *       404:
 *         description: Không tìm thấy lịch biểu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
app.put('/updateSchedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, startTime, duration, repeat } = req.body;
        if (!startTime || !duration || !repeat) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        const schedule = await Schedule.findByIdAndUpdate(
            id,
            {
                status: status || false,
                startTime,
                duration,
                repeat
            },
            { new: true }
        );
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedule/deleteSchedule/{id}:
 *   delete:
 *     summary: Xóa lịch biểu
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch biểu cần xóa
 *     responses:
 *       200:
 *         description: Xóa lịch biểu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule deleted successfully"
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid schedule ID"
 *       404:
 *         description: Không tìm thấy lịch biểu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */ 
app.delete('/deleteSchedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        await Schedule.findByIdAndDelete(id);
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedule/listSchedule:
 *   get:
 *     summary: Danh sách tất cả lịch biểu
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: Trả về danh sách lịch biểu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *             examples:
 *               scheduleList:
 *                 summary: Danh sách lịch biểu
 *                 value:
 *                   - _id: "60d5ecb54b6cf82de4d7a8c1"
 *                     status: true
 *                     startTime: "2024-03-25T10:30:00Z"
 *                     duration: 3600
 *                     repeat: ["Monday", "Wednesday", "Friday"]
 *                   - _id: "60d5ecb54b6cf82de4d7a8c2"
 *                     status: false
 *                     startTime: "2024-03-26T14:45:00Z"
 *                     duration: 1800
 *                     repeat: ["Tuesday", "Thursday"]
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
app.get('/listSchedule', async (req, res) => {
    try {
        const schedule = await Schedule.find();
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;
