const express = require('express');
const User = require('../models/userModel');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
const nodemailer = require('nodemailer');

require('dotenv').config({
  path: './utils/config.env',
});

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

const authenticateJWT = require('../middlewares/authMiddleware');
const otpStore = {};
const pendingRegistrations = {};
const registeredUsers = {};

const createToken = userId => {
  const payload = {
    userId: userId,
  };
  const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', {expiresIn: '1h'});
  return token;
};
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Example JSON data for testing
 *             email: "vana@gmail.com"
 *             password: "1"
 *             deviceID: "12345-abcde"
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - deviceID
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               deviceID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token and user type
 *       404:
 *         description: User not found or invalid credentials
 *       500:
 *         description: Internal server error
 */
app.post('/login', async (req, res) => {
  const {email, password, deviceID} = req.body;

  if (!email || !password || !deviceID) {
    return res.status(400).json({
      status: 400,
      message: 'Email, password, and deviceID are required',
    });
  }

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({status: 404, message: 'User not found'});
    }
    if (user.password !== password) {
      return res.status(404).json({status: 404, message: 'Invalid password'});
    }

    // Kiểm tra nếu có người dùng khác đã đăng nhập
    if (user.deviceID && user.deviceID !== deviceID) {
      // Hủy phiên đăng nhập trước bằng cách cập nhật token rỗng hoặc đổi token
      user.token = null;
      return res.status(404).json({status: 404, message: 'Account is logged in', data: user.token});
    }

    user.deviceID = deviceID; // Cập nhật deviceID
    const token = createToken(user._id); // Tạo token mới
    user.token = token; // Lưu token vào database
    await user.save();

    res.status(200).json({data: token, status: 200});
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({status: 500, message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     summary: Get information about a user
 *     tags: [Information]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     security:
 *       - bearerAuth: [] # Bảo mật với JWT
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Token is invalid or expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

app.get('/profile/:id', async (req, res) => {
  try {
    const {id} = req.params;
    // if (req.user.userId !== id) {
    //   return res.status(403).json({message: 'Access denied'});
    // }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({status: 200, data: user});
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/sendCode/{email}:
 *   get:
 *     summary: Send a verification code via email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The recipient's email address
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Email sent successfully"
 *               code: "123456"
 *       500:
 *         description: Failed to send email or configuration error
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to send email"
 *               error: "Error description"
 */
app.get('/sendCode/:email', async (req, res) => {
  const email = req.params.email;
  if (registeredUsers[email]) {
    return res.status(400).json({message: 'User already registered!'});
  }
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({message: 'Email configuration error'});
    }

    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = {
      code: String(randomNumber),
      expires: Date.now() + 3 * 60 * 1000, // Hết hạn sau 3 phút
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác thực của bạn',
      text: `Mã xác thực của bạn là: ${randomNumber}`,
    };

    await transporter.sendMail(mailOptions);
    pendingRegistrations[email] = true; // Đánh dấu email đang chờ xác thực

    res.status(200).json({
      message: 'Email sent successfully',
      code: String(randomNumber),
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res
      .status(500)
      .json({message: 'Failed to send email', error: error.message});
  }
});

/**
 * @swagger
 * /api/user/verifyOTP:
 *   post:
 *     summary: Verify the OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
app.post('/verifyOTP', (req, res) => {
  const {email, code} = req.body;

  try {
    const otpEntry = otpStore[email];

    // Kiểm tra mã OTP
    if (!otpEntry) {
      return res
        .status(400)
        .json({message: 'OTP does not exist or is invalid'});
    }

    if (otpEntry.code !== code) {
      return res.status(400).json({message: 'Invalid OTP code'});
    }

    if (Date.now() > otpEntry.expires) {
      delete otpStore[email]; // Xóa mã OTP đã hết hạn
      return res.status(400).json({message: 'OTP has expired'});
    }

    // Xóa mã OTP đã xác thực
    delete otpStore[email];
    res.status(200).json({message: 'OTP verified successfully'});
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             name: "Nguyen van A"
 *             email: "vana@gmail.com"
 *             password: "1"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (registeredUsers[email]) {
    return res.status(400).json({ message: 'User already registered!' });
  }

  if (!pendingRegistrations[email]) {
    return res.status(400).json({ message: 'Please verify your OTP before registering' });
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Tạo user mới
    const newUser = new User({ name, email, password });
    const token = createToken(newUser._id); // Tạo token mới
    newUser.token = token; // Lưu token vào database
    await newUser.save();

    // Xóa trạng thái đăng ký
    registeredUsers[email] = true;
    delete pendingRegistrations[email];

    return res.status(200).json({
      message: 'User registered successfully!',
      token, // Trả về token để tự động đăng nhập
      status: 200,
    });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = app;
