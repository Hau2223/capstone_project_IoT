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
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'User registered successfully!' });
    })
    .catch(err => {
      if (err.code === 11000) {
        res.status(400).json({ message: 'Email already exists!' });
      } else {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal server error!' });
      }
    });
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
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       404:
 *         description: User not found or invalid credentials
 *       500:
 *         description: Internal server error
 */
app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({message: 'Email and the password are required'});
  }

  User.findOne({username})
    .then(user => {
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      if (user.password !== password) {
        return res.status(404).json({message: 'Invalid Password'});
      }
      const token = createToken(user._id);
      const type = user.type;
      res.status(200).json({type, token, status: 200});
    })
    .catch(err => {
      console.log('Error in finding the user', err);
      res.status(404).json({message: 'Internal server Error!'});
    });
});

module.exports = app;
