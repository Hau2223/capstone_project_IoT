const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Device = require('../models/deviceModel');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * @swagger
 * /api/control/updateControl/{id_esp}/{controlId}:
 *   put:
 *     summary: Cập nhật control theo ID
 *     tags: [Controls]
 *     parameters:
 *       - in: path
 *         name: id_esp
 *         required: true
 *         description: ID của thiết bị
 *         schema:
 *           type: string
 *           example: "ESP123456"
 *       - in: path
 *         name: controlId
 *         required: true
 *         description: ID của control cần cập nhật
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
 *               name:
 *                 type: string
 *                 example: "light"
 *               status:
 *                 type: boolean
 *                 example: true
 *               threshold_min:
 *                 type: number
 *                 example: 10
 *               threshold_max:
 *                 type: number
 *                 example: 90
 *               mode:
 *                 type: string
 *                 enum: ["manual", "schedule", "threshold"]
 *                 example: "threshold"
 *     responses:
 *       200:
 *         description: Cập nhật control thành công
 *       404:
 *         description: Thiết bị hoặc control không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
app.put('/updateControl/:id_esp/:controlId', async (req, res) => {
  try {
    const {id_esp, controlId} = req.params;
    const {name, status, threshold_min, threshold_max, mode} = req.body;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const control = device.controls.find(c => c._id.toString() === controlId);
    if (!control) {
      return res.status(404).json({message: 'Control not found'});
    }

    // Cập nhật control
    if (name) {
      control.name = name;
    }
    if (status !== undefined) {
      control.status = status;
    }
    if (threshold_min !== undefined) {
      control.threshold_min = threshold_min;
    }
    if (threshold_max !== undefined) {
      control.threshold_max = threshold_max;
    }
    if (mode) {
      control.mode = mode;
    }
    await device.save();
    res
      .status(200)
      .json({message: 'Control updated successfully', data: control});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating control', error: error.message});
  }
});

/**
 * @swagger
 * /api/control/updateControls/{id_esp}:
 *   put:
 *     summary: Cập nhật nhiều control theo ID thiết bị
 *     tags: [Controls]
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
 *                 controlId:
 *                   type: string
 *                   example: "67ef7f21a7feea8813df4365"
 *                 name:
 *                   type: string
 *                   example: "New Control Name"
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 threshold_min:
 *                   type: number
 *                   example: 10
 *                 threshold_max:
 *                   type: number
 *                   example: 90
 *                 mode:
 *                   type: string
 *                   enum: ["manual", "schedule", "threshold"]
 *                   example: "schedule"
 *     responses:
 *       200:
 *         description: Cập nhật các control thành công
 *       404:
 *         description: Thiết bị không tìm thấy hoặc một trong các control không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
app.put('/updateControls/:id_esp', async (req, res) => {
  try {
    const {id_esp} = req.params;
    const controlsToUpdate = req.body;

    const device = await Device.findOne({id_esp});
    if (!device) {
      return res.status(404).json({message: 'Device not found'});
    }

    const updatedControls = [];

    for (const controlData of controlsToUpdate) {
      const {controlId, name, status, threshold_min, threshold_max, mode} =
        controlData;

      const control = device.controls.find(c => c._id.toString() === controlId);
      if (!control) {
        return res
          .status(404)
          .json({message: `Control with ID ${controlId} not found`});
      }

      // Cập nhật control
      if (name) {
        control.name = name;
      }
      if (status !== undefined) {
        control.status = status;
      }
      if (threshold_min !== undefined) {
        control.threshold_min = threshold_min;
      }
      if (threshold_max !== undefined) {
        control.threshold_max = threshold_max;
      }
      if (mode) {
        control.mode = mode;
      }

      updatedControls.push(control);
    }

    await device.save();

    res
      .status(200)
      .json({message: 'Controls updated successfully', data: updatedControls});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error updating controls', error: error.message});
  }
});

module.exports = app;
