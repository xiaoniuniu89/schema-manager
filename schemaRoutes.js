const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Serve the HTML upload form (now renders the EJS template)
router.get('/upload', (req, res) => {
    res.render('upload');
});

// Serve the schema management interface (now renders the EJS template)
router.get('/manage', (req, res) => {
    res.render('manage');
});

// Route to list available schemas
router.get('/schemas', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            return res.status(500).send('Error reading schemas');
        }
        const schemas = files.filter(file => path.extname(file) === '.json');
        res.json(schemas);
    });
});

// Helper function to sanitize entity and field names for SQL
const sanitizeName = (name) => {
    return name.replace(/[\s-]/g, '_'); // Replace spaces and hyphens with underscores
};

// Route to generate tables from a schema
router.post('/generate-tables/:schema', (req, res) => {
    const schemaName = req.params.schema;
    const schemaPath = path.join(__dirname, 'uploads', schemaName + '.json');

    fs.readFile(schemaPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading schema');
        }

        const schema = JSON.parse(data);

        schema.forEach(entity => {
            // Sanitize the entity name
            const sanitizedEntityName = sanitizeName(entity.name);

            let createTableQuery = `CREATE TABLE IF NOT EXISTS ${sanitizedEntityName} (`;

            const fields = entity.fields.map(field => sanitizeName(field.name));

            // Add the id column only if it's not already defined in the schema
            if (!fields.includes('id')) {
                createTableQuery += 'id INTEGER PRIMARY KEY AUTOINCREMENT, ';
            }

            createTableQuery += entity.fields.map(field => `${sanitizeName(field.name)} ${field.type.toUpperCase()}`).join(', ');
            createTableQuery += ');';

            db.run(createTableQuery, [], (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                }
            });
        });

        res.send('Tables generated successfully.');
    });
});


// Handle file upload and save the JSON schema
router.post('/upload', upload.single('schema'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

    fs.rename(tempPath, targetPath, err => {
        if (err) return res.status(500).send("Error saving file.");
        res.send("File uploaded successfully.");
    });
});

// Dynamic route to return the JSON data from the uploaded file
router.get('/schema/:filename', (req, res) => {
    const filename = req.params.filename + '.json';
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found.");
    }
});

// Endpoint to list all entities and their CRUD routes
router.get('/sdk/entities', (req, res) => {
    const schemaDir = path.join(__dirname, 'uploads');
    fs.readdir(schemaDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading schemas');
        }
        const schemas = files.filter(file => path.extname(file) === '.json');
        const entities = schemas.map(file => {
            const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'));
            return schema.map(entity => ({
                name: entity.name,
                endpoints: {
                    getAll: `/api/${entity.name}`,
                    getOne: `/api/${entity.name}/:id`,
                    create: `/api/${entity.name}`,
                    update: `/api/${entity.name}/:id`,
                    delete: `/api/${entity.name}/:id`
                }
            }));
        }).flat();
        res.json(entities);
    });
});


module.exports = router;
