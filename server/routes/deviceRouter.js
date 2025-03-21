const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/**
 * @swagger
 * /api/device/create:
 *   post:
 *     summary: Create or update a device
 *     description: Creates a new device or updates an existing one based on id_esp.
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
 *                 example: "ESP123456"
 *               time:
 *                 type: string
 *                 example: "2025-03-21T10:00:00Z"
 *               status:
 *                 type: boolean
 *                 example: true
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb123"
 *                     role:
 *                       type: string
 *                       enum: ["owner", "member"]
 *                       example: "member"
 *               sensors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sensorId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb456"
 *               controls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     controlId:
 *                       type: string
 *                       example: "60d5f9b7e1d4a029c8dcb789"
 *     responses:
 *       201:
 *         description: Device created/updated successfully
 *       500:
 *         description: Error processing device
 */
app.post('/create', async (req, res) => {
  try {
    const {id_esp, time, status, members, sensors, controls} = req.body;

    let device = await Device.findOne({id_esp});

    if (!device) {
      device = new Device({id_esp, time, status, members, sensors, controls});
    } else {
      device.time = time;
      device.status = status;

      members.forEach(member => {
        if (!device.members.some(m => m.userId.equals(member.userId))) {
          if (
            member.role === 'owner' &&
            device.members.some(m => m.role === 'owner')
          ) {
            return;
          }
          device.members.push(member);
        }
      });

      sensors.forEach(sensor => {
        if (!device.sensors.some(s => s.sensorId.equals(sensor.sensorId))) {
          device.sensors.push(sensor);
        }
      });

      controls.forEach(control => {
        if (!device.controls.some(c => c.controlId.equals(control.controlId))) {
          device.controls.push(control);
        }
      });
    }

    await device.save();
    res
      .status(201)
      .json({message: 'Device created/updated successfully', device});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error processing device', error: error.message});
  }
});

module.exports = app;
