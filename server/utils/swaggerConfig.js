const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT API',
      version: '1.0.0',
      description: 'API Documentation for IoT project',
    },
    tags: [
      { name: 'Authentication'},
      { name: 'Controls'},
      { name: 'Devices'},
      { name: 'Sensors'},
      { name: 'Information'},
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://192.168.1.158:8000',
        // //https://capstone-project-iot-1.onrender.com
        // //http://localhost:8000
        // //http://192.168.0.241:8000
      },
    ],
  },
  apis: ['./routes/*.js'], // Chỉ định đọc các file trong thư mục routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
