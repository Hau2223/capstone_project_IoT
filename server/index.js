const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
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

// Cấu hình Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0', // Chỉ định phiên bản OpenAPI
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API cho dự án IoT',
    },
  },
  apis: ['./index.js'], // Đọc tài liệu API từ file hiện tại
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware CORS
app.use(cors());

// API đơn giản
/**
 * @swagger
 * /hello:
 *   get:
 *     description: Lấy thông tin từ API
 *     responses:
 *       200:
 *         description: Thành công
 */
app.get('/hello', (req, res) => {
  res.send('Welcome to my API!');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
