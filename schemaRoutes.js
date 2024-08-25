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
    const schemaPath = path.join(__dirname, 'uploads', `${schemaName}.json`);

    fs.readFile(schemaPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading schema: ' +err);
        }

        const schema = JSON.parse(data);

        schema.forEach(entity => {
            // Use schema name as a namespace for table names
            const tableName = `${sanitizeName(schemaName)}_${sanitizeName(entity.name)}`;

            let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

            const fields = entity.fields.map(field => sanitizeName(field.name));

            // Add the id column only if it's not already defined in the schema
            if (!fields.includes('id')) {
                createTableQuery += 'id INTEGER PRIMARY KEY AUTOINCREMENT, ';
            }

            createTableQuery += entity.fields.map(field => `${sanitizeName(field.name)} ${field.type.toUpperCase()}`).join(', ');
            createTableQuery += ');';

            db.run(createTableQuery, [], (err) => {
                if (err) {
                    console.error(`Error creating table ${tableName}:`, err.message);
                } else {
                    console.log(`Table ${tableName} created successfully.`);
                }
            });
        });

        res.send('Tables generated successfully.');
    });
});


router.post('/upload', upload.single('schema'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

    // If overwrite flag is set, overwrite the existing file
    if (req.body.overwrite === 'true' && fs.existsSync(targetPath)) {
        fs.rename(tempPath, targetPath, err => {
            if (err) return res.status(500).send("Error overwriting file.");
            return res.send("File overwritten successfully.");
        });
    } else if (fs.existsSync(targetPath)) {
        // Respond to the frontend indicating the file already exists
        fs.unlink(tempPath, () => {}); // Delete the temp file
        return res.status(409).send("File already exists. Do you want to overwrite?");
    } else {
        // If no conflict, rename (move) the file to the target location
        fs.rename(tempPath, targetPath, err => {
            if (err) return res.status(500).send("Error saving file.");
            res.send("File uploaded successfully.");
        });
    }
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
            const sanitizedFileName = sanitizeName(file.replace(/\.json$/, ''));
            return schema.map(entity => ({
                name: (`${sanitizedFileName}_${sanitizeName(entity.name)}`),
                endpoints: {
                    getAll: `/api/${sanitizedFileName}_${sanitizeName(entity.name)}`,
                    getOne: `/api/${sanitizedFileName}_${sanitizeName(entity.name)}/:id`,
                    create: `/api/${sanitizedFileName}_${sanitizeName(entity.name)}`,
                    update: `/api/${sanitizedFileName}_${sanitizeName(entity.name)}/:id`,
                    delete: `/api/${sanitizedFileName}_${sanitizeName(entity.name)}/:id`
                }
            }));
        }).flat();
        res.json(entities);
    });
});


module.exports = router;
