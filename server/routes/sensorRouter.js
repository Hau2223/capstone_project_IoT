const express = require('express');
const Sensor = require('../models/sensorModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
/**
 * @swagger
 * /api/sensor/create:
 *   post:
 *     summary: post sensor data
 *     tags: [Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             idDevice: 'device-123'
 *             ipDevice: 'IP-Devive-001'
 *             soilMoisture: 5
 *             temperature: 8
 *             humidity: 8
 *             rainCover: 8
 *             lightIntensity: 8
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
    const {
      idDevice,
      ipDevice,
      soilMoisture,
      temperature,
      humidity,
      rainCover,
      lightIntensity,
      control,
    } = req.body;

    if (!idDevice) {
      return res.status(400).json({message: 'idDevice is required'});
    }

    // Kiểm tra nếu đã có dữ liệu cho idDevice
    const existingData = await Sensor.findOne({idDevice});

    if (existingData) {
      // Nếu đã tồn tại dữ liệu cho idDevice, cập nhật dữ liệu mới
      await Sensor.updateOne(
        {idDevice},
        {ipDevice},
        {
          $set: {
            control,
            soilMoisture,
            temperature,
            humidity,
            rainCover,
            lightIntensity,
            timestamp: new Date(),
          },
        },
      );
      return res.status(200).json({message: 'Data updated successfully'});
    }

    // Nếu chưa có dữ liệu, tạo bản ghi mới
    const newData = new Sensor({
      idDevice,
      ipDevice,
      control,
      soilMoisture,
      temperature,
      humidity,
      rainCover,
      lightIntensity,
    });
    await newData.save();

    res.status(201).json({message: 'Data saved successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error saving data', error});
  }
});

/**
 * @swagger
 * /api/sensor/getData:
 *   get:
 *     summary: Lấy danh sách dữ liệu cảm biến
 *     tags: [Sensor]
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
 *                   idDevice:
 *                     type: string
 *                     example: device-123
 *                   soilMoisture:
 *                     type: number
 *                     example: 5
 *                   temperature:
 *                     type: number
 *                     example: 25
 *                   humidity:
 *                     type: number
 *                     example: 60
 *                   rainCover:
 *                     type: number
 *                     example: 1
 *                   lightIntensity:
 *                     type: number
 *                     example: 1200
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-17T08:15:30Z"
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
app.get('/getData', async (req, res) => {
  try {
    const data = await Sensor.find().sort({timestamp: -1});
    res.json(data);
  } catch (error) {
    res.status(500).json({message: 'Error fetching data', error});
  }
});


module.exports = app;
