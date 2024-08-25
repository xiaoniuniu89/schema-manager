const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const app = express();
const favicon = require('serve-favicon');
const PORT = 8002;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.json());
app.use(cors());

// Serve Swagger UI at /swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import and use the generated API routes
const apiRoutes = require('./api');

// Check if there are any entities exported
if (Object.keys(apiRoutes).length === 0) {
    console.warn('Warning: No API routes found. Please generate endpoints.');
} else {
    // Register routes for each entity
    Object.keys(apiRoutes).forEach(entity => {
        app.use(`/api/${entity}`, apiRoutes[entity]);
        console.log(`Registered /api/${entity} routes`);
    });
}

// Import and use the schema-related routes
app.use(require('./schemaRoutes'));

// Import and use the endpoint synchronization routes
app.use(require('./syncEndpoints'));

// Simple route to check if the server is running
app.get('/status', (req, res) => {
    res.json({
        message: 'Express server is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Render the homepage
app.get('/', (req, res) => {
    res.render('index');
});

// Render the schema upload page
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Render the manage schemas page
app.get('/manage', (req, res) => {
    res.render('manage');
});

// Render the view schema page
app.get('/view-schema', (req, res) => {
    const schemaName = req.query.schema;
    res.render('viewSchema', { schemaName });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
