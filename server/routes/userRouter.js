const express = require('express');
const User = require('../models/userModel');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const passportGoogle = require('../utils/passportGoogle');
const upload = require('../middlewares/uploadImgMiddleware');
const URLIMG = require('../utils/constants').URLIMG;
const path = require('path');

require('dotenv').config({
  path: path.join(process.cwd(), '/etc/secrets/config.env'),
});

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
  const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk');
  return token;
};
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user (password is compared with hashed value)
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
 *                 description: The user's password (compared with hashed value in database)
 *               deviceID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *         content:
 *           application/json:
 *             example:
 *               data: "jwt-token-here"
 *               status: 200
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
      console.log('User not found:', email);
      return res.status(404).json({status: 404, message: 'User not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(404).json({status: 404, message: 'Invalid password'});
    }
    user.deviceID = deviceID;
    user.status = 'active';
    const token = createToken(user._id);
    await user.save();

    res.status(200).json({data: token, status: 200});
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({status: 500, message: 'Internal server error'});
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
      expires: Date.now() + 2 * 60 * 1000, // Hết hạn sau 2 phút
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

    res.status(200).json({
      message: 'Email sent successfully',
      status: 200,
      code: String(randomNumber),
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res
      .status(500)
      .json({
        status: 500,
        message: 'Failed to send email',
        error: error.message,
      });
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
    console.log(otpStore);
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
    // Đánh dấu email như đã xác minh
    pendingRegistrations[email] = true;
    res.status(200).json({status: 200, message: 'OTP verified successfully'});
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({status: 500, message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user (password will be hashed before saving)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:  # Dữ liệu JSON mẫu để test
 *             name: "Nguyen van A"
 *             email: "vana@gmail.com"
 *             password: "1"
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: The user's password (will be hashed before storing)
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully!"
 *               status: 200
 *       400:
 *         description: Email already exists or OTP not verified
 *       500:
 *         description: Internal server error
 */
app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  if (registeredUsers[email]) {
    return res.status(400).json({message: 'User already registered!'});
  }

  if (!pendingRegistrations[email]) {
    return res
      .status(400)
      .json({message: 'Please verify your OTP before registering'});
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    if (await User.findOne({email})) {
      return res.status(400).json({message: 'Email already exists!'});
    }

    // Mã hóa mật khẩu
    const saltRounds = 10; // Số vòng băm, thường là 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới với mật khẩu đã mã hóa
    const newUser = new User({name, email, password: hashedPassword});
    await newUser.save();

    // Xóa trạng thái đăng ký
    registeredUsers[email] = true;
    delete pendingRegistrations[email];

    return res.status(200).json({
      message: 'User registered successfully!',
      status: 200,
    });
  } catch (err) {
    console.error('Error registering user:', err);
    return res
      .status(500)
      .json({status: 500, message: 'Internal server error' + err});
  }
});

/**
 * @swagger
 * /api/user/resetPassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's registered email address
 *               newPassword:
 *                 type: string
 *                 description: The new password (will be hashed before storing)
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset successfully!"
 *       400:
 *         description: User not found or invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
app.post('/resetPassword', async (req, res) => {
  const {email, newPassword} = req.body;

  try {
    if (!registeredUsers[email]) {
      return res.status(400).json({message: 'User not found!'});
    }
    // Mã hóa mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const user = await User.findOneAndUpdate(
      {email},
      {password: hashedPassword},
      {new: true},
    );

    if (!user) {
      return res.status(400).json({message: 'User not found!'});
    }
    delete pendingRegistrations[email];
    res.status(200).json({message: 'Password reset successfully!'});
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get information about the logged-in user
 *     tags: [Information]
 *     security:
 *       - bearerAuth: [] # Bảo mật với JWT
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "vana@gmail.com"
 *                     # Thêm các trường khác nếu cần
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Token is invalid or expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    // if (req.user.userId !== id) {
    //   return res.status(403).json({message: 'Access denied'});
    // }

    const user = await User.findById(userId).select(
      'name email avatar deviceID gardenId gender status phone address dob role',
    );
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
 * /api/user/logout:
 *   post:
 *     summary: Logout a user by invalidating their token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.post('/logout', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm người dùng và xóa token
    await User.findByIdAndUpdate(userId, {token: null});

    res.status(200).json({status: 200, message: 'Logout successful'});
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({status: 500, message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/getGardenby:
 *   get:
 *     summary: lấy thông tin garden theo id user
 *     tags: [Information]
 *     security:
 *       - bearerAuth: [] # Bảo mật với JWT
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "vana@gmail.com"
 *                     # Thêm các trường khác nếu cần
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Token is invalid or expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.get('/getGardenby', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    // if (req.user.userId !== id) {
    //   return res.status(403).json({message: 'Access denied'});
    // }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({status: 200, data: user.gardenId});
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({status: 500, message: 'Internal server error'});
  }
});

/**
 * @swagger
 * /api/user/updateProfile:
 *   put:
 *     summary: Cập nhật thông tin tài khoản người dùng
 *     tags: [Information]
 *     security:
 *       - bearerAuth: [] # Bảo mật với JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Nguyen Van B"
 *             full_name: "Nguyễn Văn B"
 *             avatar: "avatar_url.jpg"
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               full_name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng được cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Profile updated successfully"
 *               data:
 *                 name: "Nguyen Van B"
 *                 email: "example@gmail.com"
 *                 full_name: "Nguyễn Văn B"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
app.put('/updateProfile', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {name, avatar} = req.body;

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};

    // Chỉ thêm các trường có giá trị vào updateFields
    if (name !== undefined) {
      updateFields.name = name;
    }
    if (avatar !== undefined) {
      updateFields.avatar = avatar;
    }

    // Kiểm tra nếu không có trường nào được cập nhật
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No fields to update',
      });
    }

    // Tìm và cập nhật người dùng
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set: updateFields},
      {new: true}, // Trả về tài liệu đã được cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    // Trả về thông tin người dùng sau khi cập nhật
    res.status(200).json({
      status: 200,
      message: 'Profile updated successfully',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/user/updateGardenId:
 *   put:
 *     summary: Cập nhật gardenId cho người dùng
 *     tags: [Information]
 *     security:
 *       - bearerAuth: [] # Bảo mật với JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gardenId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d5ec49b547b3d949e7c6c2", "60d5ec49b547b3d949e7c6c3"]
 *     responses:
 *       200:
 *         description: Cập nhật gardenId thành công
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Garden ID updated successfully"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
app.put('/updateGardenId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {gardenId} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!Array.isArray(gardenId)) {
      return res.status(400).json({
        status: 400,
        message: 'gardenId must be an array',
      });
    }
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    // Cập nhật gardenId mà không mất dữ liệu cũ
    user.gardenId = [...new Set([...user.gardenId, ...gardenId])]; // Kết hợp và loại bỏ trùng lặp
    await user.save(); // Lưu thay đổi
    res.status(200).json({
      status: 200,
      message: 'Garden ID updated successfully',
      data: user.gardenId,
    });
  } catch (error) {
    console.error('Error updating garden ID:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/user/changePassword:
 *   put:
 *     summary: Thay đổi mật khẩu của người dùng (hoặc đặt lần đầu nếu chưa có)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # Cần JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại (nếu đã có)
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới muốn đặt
 *           example:
 *             currentPassword: "1234567890"   # Có thể bỏ qua nếu user đăng nhập bằng Google chưa từng đặt mật khẩu
 *             newPassword: "12345678"
 *     responses:
 *       200:
 *         description: Mật khẩu được đổi thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Password changed successfully"
 *       401:
 *         description: Mật khẩu hiện tại không chính xác hoặc chưa đăng nhập
 *         content:
 *           application/json:
 *             example:
 *               message: "Current password is incorrect"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
app.put('/changePassword', authenticateJWT, async (req, res) => {
  const {currentPassword, newPassword} = req.body;

  const user = await User.findById(req.user.userId).select('+password');

  // Trường hợp user chưa có mật khẩu → cho phép đặt trực tiếp
  if (!user.password) {
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json({status: 200, message: 'Password set successfully'});
  }

  // Nếu user có mật khẩu → cần xác thực mật khẩu cũ
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({message: 'Current password is incorrect'});
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({status: 200, message: 'Password changed successfully'});
});

app.use('/uploads', express.static('uploads'));

/**
 * @swagger
 * /api/user/avatar:
 *   put:
 *     summary: Upload hoặc cập nhật ảnh đại diện của người dùng
 *     tags: [Information]
 *     security:
 *       - bearerAuth: []  # Yêu cầu token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File hình ảnh avatar
 *     responses:
 *       200:
 *         description: Ảnh đại diện được cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Avatar updated"
 *               avatar: "/uploads/1683729332829.jpg"
 *       400:
 *         description: Không có ảnh được tải lên
 *         content:
 *           application/json:
 *             example:
 *               message: "No image uploaded"
 *       500:
 *         description: Có lỗi trong quá trình upload
 *         content:
 *           application/json:
 *             example:
 *               message: "Error uploading avatar"
 *               error: "Chi tiết lỗi"
 */
app.put(
  '/avatar',
  authenticateJWT,
  (req, res, next) => {
    upload.single('avatar')(req, res, function (err) {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .json({message: 'Ảnh vượt quá dung lượng tối đa 5MB'});
        }
        return res.status(400).json({message: err.message});
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const filePath = req.file ? `/uploads/${req.file.filename}` : null;

      if (!filePath) {
        return res.status(400).json({message: 'No image uploaded'});
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {avatar: URLIMG.urlUser + filePath},
        {new: true},
      );

      res.status(200).json({
        status: 200,
        message: 'Avatar updated',
        avatar: updatedUser.avatar,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Error uploading avatar',
        error: err.message,
      });
    }
  },
);

app.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email']}),
);

app.get(
  '/google/callback',
  passport.authenticate('google', {session: false}),
  (req, res) => {
    const token = jwt.sign({userId: req.user._id}, 'Q$r2K6W8n!jCW%Zk');
    res.redirect(`${CONFIGURL.url}/api/user/show-token?token=${token}`); // để gửi về ứng dụng di động
  },
);
//https://capstone-project-iot-1.onrender.com

app.get('/show-token', (req, res) => {
  const token = req.query.token;
  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h2>🎉 Đăng nhập bằng Google thành công!</h2>
        <p><strong>Token của bạn:</strong></p>
        <textarea rows="6" cols="80" readonly>${token}</textarea>
      </body>
    </html>
  `);
});

module.exports = app;
