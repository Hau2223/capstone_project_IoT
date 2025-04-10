const express = require('express');
const Report = require('../models/reportModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/report/detailReport/{deviceId}:
 *   get:
 *     summary: Lấy thông tin báo cáo theo deviceId
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thiết bị cần lấy báo cáo
 *     responses:
 *       200:
 *         description: Trả về danh sách báo cáo của thiết bị
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: Không tìm thấy báo cáo nào cho thiết bị
 *         content:
 *           application/json:
 *             example:
 *               message: "No reports found for this device"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               message: "Error fetching data"
 */
app.get('/detailReport/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const reports = await Report.find({ deviceId });

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found for this device' });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});


/**
 * @swagger
 * /api/report/createReport:
 *   post:
 *     summary: Tạo báo cáo mới
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *           examples:
 *             fullReport:
 *               summary: Ví dụ báo cáo đầy đủ
 *               value:
 *                 deviceId: "abc123"
 *                 time_created: "2024-03-25T10:30:00Z"
 *                 water_usage: 50
 *                 water_duration: 120
 *                 light_usage: 30
 *                 light_duration: 180
 *             defaultReport:
 *               summary: Ví dụ báo cáo mặc định
 *               value:
 *                 deviceId: "xyz456"
 *                 water_usage: 40
 *                 water_duration: 90
 *                 light_usage: 20
 *                 light_duration: 150
 *     responses:
 *       201:
 *         description: Tạo báo cáo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *             examples:
 *               successResponse:
 *                 summary: Kết quả tạo báo cáo thành công
 *                 value:
 *                   _id: "60d5ecb54b6cf82de4d7a8c2"
 *                   deviceId: "abc123"
 *                   time_created: "2024-03-25T10:30:00Z"
 *                   water_usage: 50
 *                   water_duration: 120
 *                   light_usage: 30
 *                   light_duration: 180
 *                   createdAt: "2024-03-25T10:30:00Z"
 *                   updatedAt: "2024-03-25T10:35:00Z"
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
 *             examples:
 *               missingFields:
 *                 summary: Thiếu thông tin bắt buộc
 *                 value:
 *                   message: "Required fields are missing"
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
 *             examples:
 *               serverError:
 *                 summary: Lỗi máy chủ nội bộ
 *                 value:
 *                   message: "Internal server error"
 */
app.post('/createReport', async (req, res) => {
  try {
    const {
      deviceId,
      time_created,
      water_usage,
      water_duration,
      light_usage,
      light_duration,
    } = req.body;
    if (
      !deviceId ||
      !water_usage ||
      !water_duration ||
      !light_usage ||
      !light_duration
    ) {
      return res.status(400).json({message: 'Missing required fields'});
    }
    const report = new Report({
      deviceId,
      time_created,
      water_usage,
      water_duration,
      light_usage,
      light_duration,
    });
    await report.save();
    res.status(201).json({message: 'Report saved successfully', report});
  } catch (error) {
    res.status(500).json({message: 'Error saving data', error});
  }
});

/**
 * @swagger
 * /api/report/updateReport/{deviceId}:
 *   put:
 *     summary: Cập nhật báo cáo mới nhất của một thiết bị
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thiết bị cần cập nhật báo cáo mới nhất
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - water_usage
 *               - water_duration
 *               - light_usage
 *               - light_duration
 *             properties:
 *               water_usage:
 *                 type: number
 *                 description: Mức sử dụng nước
 *               water_duration:
 *                 type: number
 *                 description: Thời gian sử dụng nước (giây)
 *               light_usage:
 *                 type: number
 *                 description: Mức sử dụng điện
 *               light_duration:
 *                 type: number
 *                 description: Thời gian sử dụng điện (giây)
 *           example:
 *             water_usage: 10
 *             water_duration: 300
 *             light_usage: 15
 *             light_duration: 600
 *     responses:
 *       200:
 *         description: Báo cáo cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     deviceId:
 *                       type: string
 *                     water_usage:
 *                       type: number
 *                     water_duration:
 *                       type: number
 *                     light_usage:
 *                       type: number
 *                     light_duration:
 *                       type: number
 *                     time_created:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Report updated successfully"
 *               report:
 *                 _id: "60d5ecb54b6cf82de4d7a8c1"
 *                 deviceId: "12345"
 *                 water_usage: 10
 *                 water_duration: 300
 *                 light_usage: 15
 *                 light_duration: 600
 *                 time_created: "2024-03-25T10:30:00Z"
 *       400:
 *         description: Thiếu dữ liệu yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Missing required fields"
 *       404:
 *         description: Không tìm thấy báo cáo mới nhất cho thiết bị
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "No report found for this device"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Error updating data"
 *               error: "Internal server error details"
 */
app.put('/updateReport/:deviceId', async (req, res) => {
  try {
    const {deviceId} = req.params;
    const {water_usage, water_duration, light_usage, light_duration} = req.body;

    // Validate input fields
    if (
      !deviceId ||
      !water_usage ||
      !water_duration ||
      !light_usage ||
      !light_duration
    ) {
      return res.status(400).json({message: 'Missing required fields'});
    }

    // Find the NEWEST report for this device (sorted by time_created DESCENDING)
    const newestReport = await Report.findOne({deviceId}).sort({
      time_created: -1,
    });

    if (!newestReport) {
      return res.status(404).json({message: 'No report found for this device'});
    }

    // Update the newest report
    const updatedReport = await Report.findByIdAndUpdate(
      newestReport._id,
      {
        $set: {
          water_usage,
          water_duration,
          light_usage,
          light_duration,
        },
      },
      {new: true},
    );

    res.status(200).json({
      message: 'Report updated successfully',
      report: updatedReport,
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      message: 'Error updating data',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/report/deleteReport/{id}:
 *   delete:
 *     summary: Xóa báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần xóa
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Report deleted successfully"
 *       404:
 *         description: Không tìm thấy báo cáo
 *         content:
 *           application/json:
 *             example:
 *               message: "Report not found"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               message: "Error deleting data"
 */
app.delete('/deleteReport/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) return res.status(404).json({message: 'Report not found'});
    res.status(200).json({message: 'Report deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting data', error});
  }
});

/**
 * @swagger
 * /api/report/listReport:
 *   get:
 *     summary: Lấy danh sách tất cả báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Trả về danh sách báo cáo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               message: "Error fetching data"
 */
app.get('/listReport', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({message: 'Error fetching data', error});
  }
});

module.exports = app;
