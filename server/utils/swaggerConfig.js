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
      {name: 'Authentication'},
      {name: 'Controls'},
      {name: 'Devices'},
      {name: 'Information'},
      {name: 'Members'},
      {name: 'Schedules'},
      {name: 'Sensors'},
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
        url: 'https://capstone-project-iot-1.onrender.com',
        // //https://capstone-project-iot-1.onrender.com
        // //http://localhost:8000
        // //http://192.168.1.5:8000
      },
    ],
  },
  apis: ['./routes/*.js'], // Chỉ định đọc các file trong thư mục routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
