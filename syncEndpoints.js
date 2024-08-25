const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const router = express.Router();

// Helper function to sanitize names
const sanitizeName = (name) => {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
};

// Generate Swagger paths for a given entity
const generateSwaggerPaths = (entityName) => {
    const paths = {};

    const entityPath = `/api/${entityName}`;
    const entityIdPath = `${entityPath}/:id`;

    paths[entityPath] = {
        get: {
            tags: [entityName],
            summary: `Get all ${entityName}`,
            responses: {
                200: {
                    description: `A list of ${entityName}`,
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { $ref: `#/components/schemas/${entityName}` }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: [entityName],
            summary: `Create a new ${entityName}`,
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: `#/components/schemas/${entityName}` }
                    }
                }
            },
            responses: {
                201: {
                    description: `${entityName} created`
                }
            }
        }
    };

    paths[entityIdPath] = {
        get: {
            tags: [entityName],
            summary: `Get a single ${entityName} by ID`,
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }],
            responses: {
                200: {
                    description: `A single ${entityName}`,
                    content: {
                        "application/json": {
                            schema: { $ref: `#/components/schemas/${entityName}` }
                        }
                    }
                }
            }
        },
        put: {
            tags: [entityName],
            summary: `Update an existing ${entityName}`,
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: `#/components/schemas/${entityName}` }
                    }
                }
            },
            responses: {
                200: {
                    description: `${entityName} updated`
                }
            }
        },
        delete: {
            tags: [entityName],
            summary: `Delete an existing ${entityName}`,
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }],
            responses: {
                200: {
                    description: `${entityName} deleted`
                }
            }
        }
    };

    return paths;
};

// Generate Swagger schemas for a given entity
const generateSwaggerSchemas = (sanitizedEntityName, entitySchema) => {
    const entityName = sanitizedEntityName.split('_').pop(); // Extract the original entity name
    const entityDefinition = entitySchema.definitions[entityName];

    if (!entityDefinition || !entityDefinition.properties) {
        console.error(`Entity definition or properties missing for: ${sanitizedEntityName}`);
        return {};
    }

    const properties = { ...entityDefinition.properties };
    const required = [...(entityDefinition.required || [])];

    // Handle relationships: If a property references another entity, adjust the schema accordingly
    if (entitySchema.properties) {
        Object.entries(entitySchema.properties).forEach(([fieldName, fieldSchema]) => {
            if (fieldSchema.$ref) {
                const relatedEntityName = fieldSchema.$ref.split('/').pop();
                properties[fieldName] = {
                    type: 'integer', // Assuming relationships are represented as foreign key IDs
                    description: `Reference to the ${relatedEntityName}`
                };
                // If the relationship is required, add it to the required list
                if (!required.includes(fieldName)) {
                    required.push(fieldName);
                }
            }
        });
    }

    return {
        [sanitizedEntityName]: {
            type: "object",
            properties,
            required
        }
    };
};





router.post('/sync-endpoints/:schema', (req, res) => {
    const schemaName = req.params.schema;
    const sanitizedSchemaName = sanitizeName(schemaName);
    const schemaPath = path.join(__dirname, 'uploads', `${schemaName}.json`);

    fs.readFile(schemaPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading schema');
        }

        const schema = JSON.parse(data);
        const apiFolderPath = path.join(__dirname, 'api');

        if (!fs.existsSync(apiFolderPath)) {
            fs.mkdirSync(apiFolderPath);
        }

        const indexFilePath = path.join(apiFolderPath, 'index.js');
        let indexFileContent = '';
        if (fs.existsSync(indexFilePath)) {
            indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
        }

        let swaggerPaths = {};
        let swaggerSchemas = {};

        schema.forEach(entity => {
            const sanitizedEntityName = `${sanitizedSchemaName}_${sanitizeName(entity.name)}`;
            const entityFilePath = path.join(apiFolderPath, `${sanitizedEntityName}.js`);

            const routeDefinitions = `
            const express = require('express');
            const db = require('../db');
            const router = express.Router();

            router.post('/', (req, res) => {
                const columns = ${JSON.stringify(Object.keys(entity.jsonSchema.properties))}.join(', ');
                const placeholders = ${JSON.stringify(Object.keys(entity.jsonSchema.properties).map(() => '?'))}.join(', ');
                const values = [${Object.keys(entity.jsonSchema.properties).map(key => `req.body['${key}']`).join(', ')}];

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
                const updates = ${JSON.stringify(Object.keys(entity.jsonSchema.properties).map(key => `"${sanitizeName(key)}" = ?`))}.join(', ');
                const values = [${Object.keys(entity.jsonSchema.properties).map(key => `req.body['${key}']`).join(', ')}];
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

            fs.writeFileSync(entityFilePath, routeDefinitions);

            const exportStatement = `module.exports.${sanitizedEntityName} = require('./${sanitizedEntityName}');`;

            if (!indexFileContent.includes(exportStatement)) {
                indexFileContent += `${exportStatement}\n`;
            }

            swaggerPaths = {
                ...swaggerPaths,
                ...generateSwaggerPaths(sanitizedEntityName)
            };

            swaggerSchemas = {
                ...swaggerSchemas,
                ...generateSwaggerSchemas(sanitizedEntityName, entity.jsonSchema)
            };
        });

        fs.writeFileSync(indexFilePath, indexFileContent);

        const swaggerFilePath = path.join(__dirname, 'swaggerConfig.js');
        const swaggerTemplate = `
        const swaggerSpec = {
            openapi: '3.0.0',
            info: {
                title: '${schemaName} API',
                version: '1.0.0',
            },
            paths: ${JSON.stringify(swaggerPaths, null, 2)},
            components: {
                schemas: ${JSON.stringify(swaggerSchemas, null, 2)}
            }
        };

        module.exports = swaggerSpec;
        `;

        fs.writeFileSync(swaggerFilePath, swaggerTemplate);

        res.send('API endpoints synchronized and Swagger documentation generated successfully.');
    });
});

module.exports = router;
