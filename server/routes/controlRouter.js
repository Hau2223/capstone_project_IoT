const express = require('express');
const Control = require('../models/controlModel');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/**
 * @swagger
 * /api/control/detailControl:
 *   get:
 *     summary: Lấy danh sách dữ liệu điều khiển
 *     tags: [Control]
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
 *     tags: [Control]
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
 * /api/control/create:
 *   post:
 *     summary: Tạo dữ liệu điều khiển mới
 *     tags: [Control]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             name: "light"
 *             status: true
 *             threshold_min: 0
 *             threshold_max: 100
 *             mode: "manual"
 *     responses:
 *       201:
 *         description: Dữ liệu đã được lưu thành công
 *       200:
 *         description: Dữ liệu đã được cập nhật thành công
 *       400:
 *         description: idDevice là bắt buộc
 *       500:
 *         description: Lỗi khi xử lý dữ liệu
 */
app.post('/createControl', async (req, res) => {
  try {
    const {name, status, threshold_min, threshold_max, mode} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
      return res.status(400).json({message: 'Missing required fields'});
    }
    if (!['manual', 'schedule', 'threshold'].includes(mode)) {
      return res.status(400).json({
        message:
          'Invalid sensor type, mode includes ["manual","schedule","threshold"]',
      });
    }

    // Tạo bản ghi mới
    const newData = new Control({
      name,
      status: status ?? false,
      threshold_min,
      threshold_max,
      mode,
    });

    await newData.save();
    res.status(201).json({message: 'Data saved successfully', data: newData});
  } catch (error) {
    res.status(500).json({message: 'Error saving data', error: error.message});
  }
});

/**
 * @swagger
 * /api/control/updateControlBy/{id}:
 *   put:
 *     summary: Cập nhật dữ liệu điều khiển
 *     tags: [Control]
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
