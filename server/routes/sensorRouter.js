const express = require('express');
const SensorData = require('../models/sensorModel');
const app = express();

/**
 * @swagger
 * /api/sensor/data:
 *   post:
 *     description: Lưu dữ liệu cảm biến vào MongoDB
 *     tags: [Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soilMoisture:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               rainCover:
 *                 type: number
 *               lightIntensity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Dữ liệu đã được lưu
 *       500:
 *         description: Lỗi khi lưu dữ liệu
 */
app.post('/data', async (req, res) => {
  try {
    const newData = new SensorData(req.body);
    await newData.save();
    res.status(201).json({message: 'Data saved successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error saving data', error});
  }
});

app.get('/data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({timestamp: -1});
    res.json(data);
  } catch (error) {
    res.status(500).json({message: 'Error fetching data', error});
  }
});

module.exports = app;
