const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swaggerConfig');
const cors = require('cors');
const app = express();
const port = 8000;

mongoose
  .connect(
    'mongodb+srv://nguyentrunghau220203:capstoneIoT@database1.yqcjs.mongodb.net/',
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
        .swagger-ui {
            padding-bottom: 30px; 
        }
    `,
  }),
);

const userRou = require('./routes/userRouter');
const deviceRou = require('./routes/deviceRouter');
const controlRou = require('./routes/controlRouter');
const sensorRou = require('./routes/sensorRouter');
const scheduleRou = require('./routes/scheduleRouter');
const reportRou = require('./routes/reportRouter');

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
    credentials: true,
  }),
);

app.use('/api/user', userRou);
app.use('/api/device', deviceRou);
app.use('/api/control', controlRou);
app.use('/api/sensor', sensorRou);
app.use('/api/schedule', scheduleRou);
app.use('/api/report', reportRou);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
