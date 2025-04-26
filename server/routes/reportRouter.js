const express = require('express');
const Report = require('../models/reportModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/**
 * @swagger
 * /api/report/detailReport/{deviceId}:
 *   get:
 *     summary: Get report details by deviceId
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to get reports for
 *     responses:
 *       200:
 *         description: List of reports for the device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found for this device
 *       500:
 *         description: Server error
 */
app.get('/detailReport/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const reports = await Report.find({ deviceId });
    if (!reports.length) {
      const now = Date.now();
      const dummyReport = {
        deviceId: deviceId,
        time_created: now,
        water_usage: 0,
        moisture_avg: [],
        luminosity_avg: [],
        tempurature_avg: [],
        humidity_avg: [],
        stream_avg: [],
        __v: 0, // Optional: Mongoose adds __v by default, you can omit it if not needed
      };

      return res.status(200).json(dummyReport);
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
 *     summary: Create a new report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
app.post('/createReport', async (req, res) => {
  try {
    const {
      deviceId,
      water_usage,
      moisture_avg,
      luminosity_avg,
      tempurature_avg,
      humidity_avg,
      stream_avg
    } = req.body;

    if (!deviceId || !water_usage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const report = new Report({
      deviceId,
      water_usage,
      moisture_avg: moisture_avg || [],
      luminosity_avg: luminosity_avg || [],
      tempurature_avg: tempurature_avg || [],
      humidity_avg: humidity_avg || [],
      stream_avg: stream_avg || []
    });

    await report.save();
    res.status(201).json({ message: 'Report saved successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
  }
});

/**
 * @swagger
 * /api/report/updateReport/{deviceId}:
 *   put:
 *     summary: Update the latest report for a device
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to update report for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               water_usage:
 *                 type: number
 *               moisture_avg:
 *                 type: array
 *                 items:
 *                   type: number
 *               luminosity_avg:
 *                 type: array
 *                 items:
 *                   type: number
 *               tempurature_avg:
 *                 type: array
 *                 items:
 *                   type: number
 *               humidity_avg:
 *                 type: array
 *                 items:
 *                   type: number
 *               stream_avg:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: No report found for this device
 *       500:
 *         description: Server error
 */
app.put('/updateReport/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const {
      water_usage,
      moisture_avg,
      luminosity_avg,
      tempurature_avg,
      humidity_avg,
      stream_avg
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }

    // Get current date at midnight
    const today = new Date();
    const twoHoursAgo = new Date(today.getTime() - 2 * 60 * 60 * 1000);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find report for today
    let report = await Report.findOne({
      deviceId,
      time_created: {
        $gte: today,
        $lt: tomorrow
      }
    });
    // If no report exists for today, create a new one
    if (!report) {
      const currentHour = new Date().getHours(); // 0 to 23
      const zerosToAdd = Math.max(Math.floor(currentHour / 2), 0);
      const padArray = (arr) => {
        const validArray = Array.isArray(arr) ? arr : [];
        return new Array(zerosToAdd).fill(0).concat(validArray);
      };
      report = new Report({
        deviceId,
        time_created: new Date(),
        water_usage: water_usage || 0,
        moisture_avg: padArray(moisture_avg),
        luminosity_avg: padArray(luminosity_avg),
        tempurature_avg: padArray(tempurature_avg),
        humidity_avg: padArray(humidity_avg),
        stream_avg: padArray(stream_avg)
      });
    } else {
      if (report.updatedAt > twoHoursAgo) {
        return res.status(429).json({
          message: 'You can only update the report once every 2 hours.'
        });
      }
      // Update existing report by appending new values
      if (water_usage !== undefined) {
        report.water_usage = water_usage;
      }
      
      // Helper function to append new values to arrays
      const appendToArray = (existingArray, newValues) => {
        if (!Array.isArray(newValues)) return existingArray;
        return [...existingArray, ...newValues];
      };

      report.moisture_avg = appendToArray(report.moisture_avg, moisture_avg);
      report.luminosity_avg = appendToArray(report.luminosity_avg, luminosity_avg);
      report.tempurature_avg = appendToArray(report.tempurature_avg, tempurature_avg);
      report.humidity_avg = appendToArray(report.humidity_avg, humidity_avg);
      report.stream_avg = appendToArray(report.stream_avg, stream_avg);
    }

    await report.save();
    res.status(200).json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      message: 'Error updating data',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/report/deleteReport/{id}:
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID to delete
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
app.delete('/deleteReport/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error });
  }
});

/**
 * @swagger
 * /api/report/listReport:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of all reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       500:
 *         description: Server error
 */
app.get('/listReport', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});


/**
 * @swagger
 * /api/report/detailReportByDate/{deviceId}:
 *   post:
 *     summary: Get report details for a device by specific date
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to get reports for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-24"
 *     responses:
 *       200:
 *         description: List of reports for the given device on the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found for this device on the specified date
 *       500:
 *         description: Server error
 */
app.post('/detailReportByDate/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required in body' });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1); // include the whole day

    const reports = await Report.find({
      deviceId,
      time_created: {
        $gte: start,
        $lt: end
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report by date', error });
  }
});
/**
 * @swagger
 * /api/report/detailReportByWeek/{deviceId}:
 *   post:
 *     summary: Get report details for a device by ISO week (e.g., 2025-W17)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to get reports for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               week:
 *                 type: string
 *                 example: "2025-W17"
 *     responses:
 *       200:
 *         description: List of reports for the device during the given ISO week
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found for this device in that week
 *       500:
 *         description: Server error
 */
app.post('/detailReportByWeek/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { week } = req.body;

    if (!week || !/^(\d{4})-W(\d{2})$/.test(week)) {
      return res.status(400).json({ message: 'Invalid or missing week format (expected YYYY-Wxx)' });
    }

    const [_, year, weekNum] = week.match(/^(\d{4})-W(\d{2})/);
    const weekNumber = parseInt(weekNum, 10);

    // Get first day of the ISO week
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOWeekStart = new Date(simple);
    if (dayOfWeek <= 4) {
      ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }

    const ISOWeekEnd = new Date(ISOWeekStart);
    ISOWeekEnd.setDate(ISOWeekStart.getDate() + 7);

    const reports = await Report.find({
      deviceId,
      time_created: {
        $gte: ISOWeekStart,
        $lt: ISOWeekEnd,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report by week', error });
  }
});
/**
 * @swagger
 * /api/report/detailReportByMonth/{deviceId}:
 *   post:
 *     summary: Get report details for a device by month (e.g., 2025-06)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to get reports for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: "2025-06"
 *                 description: Month in YYYY-MM format
 *     responses:
 *       200:
 *         description: List of reports for the device in the given month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found for this device in that month
 *       500:
 *         description: Server error
 */
app.post('/detailReportByMonth/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { month } = req.body;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'Invalid or missing month format (expected YYYY-MM)' });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 1); // first day of next month

    const reports = await Report.find({
      deviceId,
      time_created: {
        $gte: start,
        $lt: end
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report by month', error });
  }
});





module.exports = app;
