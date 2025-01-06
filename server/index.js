const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swaggerConfig');
const cors = require('cors');
const app = express();
const port = 8000;

mongoose
  .connect('mongodb+srv://nguyentrunghau220203:capstoneIoT@database1.yqcjs.mongodb.net/', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const userRou = require('./routes/userRouter');
const sensorRou = require('./routes/sensorRouter');


app.use(cors());

app.use('/api/sensor', sensorRou);
app.use('/api/user', userRou);




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
