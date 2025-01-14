const express = require('express');
const SensorData = require('../models/sensorModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
/**
 * @swagger
 * /api/sensor/data:
 *   post:
 *     summary: post sensor data
 *     tags: [Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             soilMoisture: 5
 *             temperature: 8
 *             humidity: 8
 *             rainCover: 8
 *             lightIntensity: 8
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
    res.status(200).json({message: 'Data saved successfully'});
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
