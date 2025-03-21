const express = require('express');
const Sensor = require('../models/sensorModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/sensor/detailSensor:
 *   get:
 *     summary: Lấy danh sách dữ liệu cảm biến
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Trả về danh sách dữ liệu cảm biến
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "moisture"
 *                   value:
 *                     type: number
 *                     example: 555
 *                   status:
 *                     type: boolean
 *                     example: false
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
app.get('/detailSensor', async (req, res) => {
  try {
    const data = await Sensor.find().sort({timestamp: -1});
    res.json(data);
  } catch (error) {
    res.status(500).json({message: 'Error fetching data', error});
  }
});

/**
 * @swagger
 * /api/sensor/detailSensorBy/{id}:
 *   get:
 *     summary: Lấy dữ liệu cảm biến theo ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cảm biến cần lấy dữ liệu
 *     responses:
 *       200:
 *         description: Trả về dữ liệu cảm biến theo ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: "moisture"
 *                 value:
 *                   type: number
 *                   example: 555
 *                 status:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy cảm biến
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
app.get('/detailSensorBy/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra nếu ID không hợp lệ
    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    // Tìm cảm biến theo ID
    const sensor = await Sensor.findById(id);

    // Kiểm tra nếu không tìm thấy cảm biến
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sensor data', error: error.message });
  }
});


/**
 * @swagger
 * /api/sensor/create:
 *   post:
 *     summary: Tạo dữ liệu cảm biến mới
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             type: 'moisture'
 *             value: 0
 *             status: true
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
app.post('/create', async (req, res) => {
  try {
    const {type, value, status} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!type) {
      return res.status(400).json({message: 'Missing required fields'});
    }
    if (
      ![
        'moisture',
        'light',
        'rain',
        'temperature',
        'humidity',
        'water_flow',
      ].includes(type)
    ) {
      return res.status(400).json({
          message:
            'Invalid sensor type, type includes ["moisture","light", "rain", "temperature", "humidity", "water_flow" ]',
        });
    }

    // Tạo bản ghi mới
    const newData = new Sensor({
      type,
      value,
      status: status ?? false,
    });

    await newData.save();
    res.status(201).json({message: 'Data saved successfully', data: newData});
  } catch (error) {
    res.status(500).json({message: 'Error saving data', error: error.message});
  }
});

/**
 * @swagger
 * /api/sensor/updateSensorBy/{id}:
 *   put:
 *     summary: Cập nhật dữ liệu cảm biến
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cảm biến cần cập nhật
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
 *         description: Không tìm thấy cảm biến
 *       500:
 *         description: Lỗi khi cập nhật dữ liệu
 */
app.put('/updateSensorBy/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {type, value, status} = req.body;

    // Kiểm tra nếu ID không hợp lệ
    if (!id) {
      return res.status(400).json({message: 'ID is required'});
    }
    if (
      ![
        'moisture',
        'light',
        'rain',
        'temperature',
        'humidity',
        'water_flow',
      ].includes(type)
    ) {
      return res
        .status(400)
        .json({
          message:
            'Invalid sensor type, type includes ["moisture","light", "rain", "temperature", "humidity", "water_flow" ]',
        });
    }

    // Tìm và cập nhật dữ liệu
    const updatedSensor = await Sensor.findByIdAndUpdate(
      id,
      {type, value, status},
      {new: true, runValidators: true},
    );

    // Kiểm tra nếu không tìm thấy cảm biến
    if (!updatedSensor) {
      return res.status(404).json({message: 'Sensor not found'});
    }

    res
      .status(200)
      .json({message: 'Data updated successfully', data: updatedSensor});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating data', error: error.message});
  }
});

module.exports = app;
