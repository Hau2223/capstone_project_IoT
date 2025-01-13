const express = require('express');
const User = require('../models/userModel');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

// Create a new cart
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
  const {name, email, password} = req.body;
  try {
    if (await User.findOne({email})) {
      return res.status(400).json({message: 'Email already exists!'});
    }
    await new User({name, email, password}).save();
    return res.status(200).json({message: 'User registered successfully!'});
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({message: 'Internal server error!'});
  }
});

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
  const { email, password, deviceID } = req.body;

  if (!email || !password || !deviceID) {
    return res.status(400).json({ message: 'Email, password, and deviceID are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: 'Invalid password' });
    }

    const token = createToken(user._id, deviceID);
    const type = user.type;

    res.status(200).json({ type, token, status: 200 });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
