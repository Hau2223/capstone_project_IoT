const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT API',
      version: '1.0.0',
      description: 'API Documentation for IoT project',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Chỉ định đọc các file trong thư mục routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
