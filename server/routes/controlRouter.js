const express = require('express');
const Control = require('../models/controlModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * @swagger
 * /api/control/detailControl:
 *   get:
 *     summary: Lấy danh sách dữ liệu điều khiển
 *     tags: [Controls]
 *     responses:
 *       200:
 *         description: Trả về danh sách dữ liệu điều khiển
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "light"
 *                   status:
 *                     type: boolean
 *                     example: false
 *                   threshold_min:
 *                     type: number
 *                     example: 0
 *                   threshold_max:
 *                     type: number
 *                     example: 100
 *                   mode:
 *                     type: string
 *                     example: manual
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
app.get('/detailControl', async (req, res) => {
  try {
    const data = await Control.find().sort({timestamp: -1});
    res.json(data);
  } catch (error) {
    res.status(500).json({message: 'Error fetching data', error});
  }
});

/**
 * @swagger
 * /api/control/detailControlBy/{id}:
 *   get:
 *     summary: Lấy dữ liệu điều khiển theo ID
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của điều khiển cần lấy dữ liệu
 *     responses:
 *       200:
 *         description: Trả về dữ liệu điều khiển
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "light"
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 threshold_min:
 *                   type: number
 *                   example: 0
 *                 threshold_max:
 *                   type: number
 *                   example: 100
 *                 mode:
 *                   type: string
 *                   example: "manual"
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
app.get('/detailControlBy/:id', async (req, res) => {
  try {
    const {id} = req.params;

    // Kiểm tra nếu ID không hợp lệ
    if (!id) {
      return res.status(400).json({message: 'ID is required'});
    }

    // Tìm dữ liệu theo ID
    const controlData = await Control.findById(id);

    // Kiểm tra nếu không tìm thấy dữ liệu
    if (!controlData) {
      return res.status(404).json({message: 'Control data not found'});
    }

    res.status(200).json(controlData);
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error fetching data', error: error.message});
  }
});

/**
 * @swagger
 * /api/control/createControl:
 *   post:
 *     summary: Tạo dữ liệu điều khiển mới
 *     tags: [Controls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mode
 *             properties:
 *               name:
 *                 type: string
 *                 example: "light"
 *               status:
 *                 type: boolean
 *                 example: false
 *               threshold_min:
 *                 type: number
 *                 example: 0
 *               threshold_max:
 *                 type: number
 *                 example: 100
 *               mode:
 *                 type: string
 *                 enum: [manual, schedule, threshold]
 *                 example: "manual"
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idSchedule:
 *                       type: string
 *                       example: "60d5ec49b547b3d949e7c6c2"
 *     responses:
 *       201:
 *         description: Dữ liệu điều khiển đã được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi khi tạo dữ liệu
 */
app.post('/createControl', async (req, res) => {
  try {
    const { name, status, threshold_min, threshold_max, mode, schedules } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
      return res.status(400).json({message: 'Missing required fields: name'});
    }
    if (
      typeof threshold_min !== 'number' ||
      typeof threshold_max !== 'number'
    ) {
      return res
        .status(400)
        .json({message: 'threshold_min and threshold_max must be numbers'});
    }
    if (!['manual', 'schedule', 'threshold'].includes(mode)) {
      return res.status(400).json({
        message:
          'Invalid mode, mode includes ["manual", "schedule", "threshold"]',
      });
    }
    const uniqueSchedules = schedules.filter(
      (schedule, index, self) =>
        index === self.findIndex(s => s.idSchedule === schedule.idSchedule),
    );

    // Tạo mới dữ liệu điều khiển
    const newControl = new Control({
      name,
      status,
      threshold_min,
      threshold_max,
      mode,
      schedules: uniqueSchedules, // Thêm schedules vào đối tượng
    });

    const savedControl = await newControl.save();
    res.status(201).json({ message: 'Control data created successfully', data: savedControl });
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error: error.message });
  }
});

/**
 * @swagger
 * /api/control/updateControlBy/{id}:
 *   put:
 *     summary: Cập nhật dữ liệu điều khiển
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của điều khiển cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "moisture"
 *               value:
 *                 type: number
 *                 example: 600
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Dữ liệu đã được cập nhật thành công
 *       400:
 *         description: ID không hợp lệ hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy điều khiển
 *       500:
 *         description: Lỗi khi cập nhật dữ liệu
 */
app.put('/updateControlBy/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {name, status, threshold_min, threshold_max, mode} = req.body;

    // Kiểm tra nếu ID không hợp lệ
    if (!id) {
      return res.status(400).json({message: 'ID is required'});
    }
    if (!['manual', 'schedule', 'threshold'].includes(mode)) {
      return res.status(400).json({
        message:
          'Invalid control type, mode includes ["manual","schedule","threshold"]',
      });
    }

    // Tìm và cập nhật dữ liệu
    const updatedControl = await Control.findByIdAndUpdate(
      id,
      {name, status, threshold_min, threshold_max, mode},
      {new: true, runValidators: true},
    );

    // Kiểm tra nếu không tìm thấy cảm biến
    if (!updatedControl) {
      return res.status(404).json({message: 'Sensor not found'});
    }

    res
      .status(200)
      .json({message: 'Data updated successfully', data: updatedControl});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating data', error: error.message});
  }
});

module.exports = app;
