const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const router = express.Router();

const sanitizeEntityName = (name) => {
    return name.replace(/[\s-]/g, '_'); // Replace spaces and hyphens with underscores
};

router.post('/sync-endpoints/:schema', (req, res) => {
    const schemaName = req.params.schema;
    const schemaPath = path.join(__dirname, 'uploads', schemaName + '.json');

    fs.readFile(schemaPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading schema');
        }

        const schema = JSON.parse(data);
        const apiFolderPath = path.join(__dirname, 'api');

        // Ensure the api folder exists
        if (!fs.existsSync(apiFolderPath)) {
            fs.mkdirSync(apiFolderPath);
        }

        // Read existing index.js content or initialize as empty string
        const indexFilePath = path.join(apiFolderPath, 'index.js');
        let indexFileContent = '';
        if (fs.existsSync(indexFilePath)) {
            indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
        }

        schema.forEach(entity => {
            const sanitizedEntityName = sanitizeEntityName(entity.name);
            const entityFilePath = path.join(apiFolderPath, `${sanitizedEntityName}.js`);

            // Generate CRUD endpoints for the entity
            const routeDefinitions = `
            const express = require('express');
            const db = require('../db');
            const router = express.Router();

            router.post('/', (req, res) => {
                const columns = ${JSON.stringify(entity.fields.map(field => sanitizeEntityName(field.name)))}.join(', ');
                const placeholders = ${JSON.stringify(entity.fields.map(() => '?'))}.join(', ');
                const values = [${entity.fields.map(field => `req.body['${field.name}']`).join(', ')}];

                const insertQuery = \`INSERT INTO ${sanitizedEntityName} (\${columns}) VALUES (\${placeholders})\`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM ${sanitizedEntityName}';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM ${sanitizedEntityName} WHERE id = ?';

                db.get(selectQuery, [req.params.id], (err, row) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    if (!row) {
                        return res.status(404).send('Record not found');
                    }
                    res.send(row);
                });
            });

            router.put('/:id', (req, res) => {
                const updates = ${JSON.stringify(entity.fields.map(field => `"${sanitizeEntityName(field.name)}" = ?`))}.join(', ');
                const values = [${entity.fields.map(field => `req.body['${field.name}']`).join(', ')}];
                values.push(req.params.id);

                const updateQuery = \`UPDATE ${sanitizedEntityName} SET \${updates} WHERE id = ?\`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully');
                });
            });

            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM ${sanitizedEntityName} WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            `;

            // Write or replace the entity file
            fs.writeFileSync(entityFilePath, routeDefinitions);

            // Prepare export statement for index.js
            const exportStatement = `module.exports.${sanitizedEntityName} = require('./${sanitizedEntityName}');`;

            // Append export statement to index.js if it doesn't already exist
            if (!indexFileContent.includes(exportStatement)) {
                indexFileContent += `${exportStatement}\n`;
            }
        });

        // Write back the updated index.js content
        fs.writeFileSync(indexFilePath, indexFileContent);

        res.send('API endpoints synchronized and saved successfully.');
    });
});

module.exports = router;
