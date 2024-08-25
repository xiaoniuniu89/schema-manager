// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dynamic API',
            version: '1.0.0',
            description: 'API documentation generated dynamically based on schemas',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Change this to your server's URL
            },
        ],
    },
    apis: ['./api/*.js'], // Point to your generated API files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
