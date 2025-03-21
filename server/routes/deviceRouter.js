const express = require('express');
const Device = require('../models/deviceModel');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


module.exports = app;
