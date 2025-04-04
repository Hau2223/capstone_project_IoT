const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Device = require('../models/deviceModel');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/sensor/updateSensor/{id_esp}/{sensorId}:
 *   put:
 *     summary: Cập nhật cảm biến theo ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: sensorId
 *         required: true
 *         description: ID của cảm biến cần cập nhật
 *         schema:
 *           type: string
 *           example: "67ef7f21a7feea8813df4363"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["moisture","luminosity","rain","temperature","humidity","stream"]
 *                 example: "moisture"
 *               value:
 *                 type: number
 *                 example: 55
 *     responses:
 *       200:
 *         description: Cập nhật cảm biến thành công
 *       404:
 *         description: Thiết bị hoặc cảm biến không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
app.put('/updateSensor/:id_esp/:sensorId', async (req, res) => {
  try {
    const {id_esp, sensorId} = req.params;
    const {type, value} = req.body;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const sensor = device.sensors.find(s => s._id.toString() === sensorId);
    if (!sensor) {
      return res.status(404).json({message: 'Sensor not found'});
    }

    // Cập nhật cảm biến
    if (type) {
      sensor.type = type;
    }
    if (value !== undefined) {
      sensor.value = value;
    }

    await device.save();

    res
      .status(200)
      .json({message: 'Sensor updated successfully', data: sensor});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating sensor', error: error.message});
  }
});

/**
 * @swagger
 * /api/sensor/updateSensors/{id_esp}:
 *   put:
 *     summary: Cập nhật nhiều sensor theo ID thiết bị
 *     tags: [Sensors]
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
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 sensorId:
 *                   type: string
 *                   example: "67efa20e81a5bd9d16d2b6c5"
 *                 type:
 *                   type: string
 *                   enum: ["moisture","luminosity","rain","temperature","humidity","stream"]
 *                   example: "moisture"
 *                 value:
 *                   type: number
 *                   example: 55
 *     responses:
 *       200:
 *         description: Cập nhật các sensor thành công
 *       404:
 *         description: Thiết bị không tìm thấy hoặc một trong các sensor không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
app.put('/updateSensors/:id_esp/', async (req, res) => {
  try {
    const {id_esp} = req.params;
    const sensorsToUpdate = req.body;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const updatedSensors = [];

    for (const sensorData of sensorsToUpdate) {
      const {sensorId, type, value} = sensorData;

      const sensor = device.sensors.find(s => s._id.toString() === sensorId);
      if (!sensor) {
        return res
          .status(404)
          .json({message: `Sensor with ID ${sensorId} not found`});
      }

      // Cập nhật sensor
      if (type) {
        sensor.type = type;
      }
      if (value !== undefined) {
        sensor.value = value;
      }

      updatedSensors.push(sensor);
    }

    await device.save();

    res
      .status(200)
      .json({message: 'Sensors updated successfully', data: updatedSensors});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating sensors', error: error.message});
  }
});

module.exports = app;
