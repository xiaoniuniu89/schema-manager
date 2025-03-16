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

// Get existing Swagger configuration or create a new one
const getExistingSwaggerConfig = () => {
    const swaggerFilePath = path.join(__dirname, 'swaggerConfig.js');
    
    if (fs.existsSync(swaggerFilePath)) {
        // Delete cache to ensure we get the latest version
        delete require.cache[require.resolve(swaggerFilePath)];
        
        try {
            return require(swaggerFilePath);
        } catch (error) {
            console.error('Error loading existing Swagger config:', error);
        }
    }
    
    // Return a default config if file doesn't exist or there was an error
    return {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
        paths: {},
        components: {
            schemas: {}
        }
    };
};

// Write updated Swagger configuration
const writeSwaggerConfig = (config) => {
    const swaggerFilePath = path.join(__dirname, 'swaggerConfig.js');
    
    const swaggerTemplate = `
    const swaggerSpec = ${JSON.stringify(config, null, 2)};

    module.exports = swaggerSpec;
    `;

    fs.writeFileSync(swaggerFilePath, swaggerTemplate);
};

router.post('/sync-endpoints/:schema', (req, res) => {
    const schemaName = req.params.schema;
    const sanitizedSchemaName = sanitizeName(schemaName);
    const schemaPath = path.join(__dirname, 'uploads', `${schemaName}.json`);

    fs.readFile(schemaPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
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

        // Get existing Swagger configuration
        const existingSwaggerConfig = getExistingSwaggerConfig();
        
        // Initialize paths and schemas with existing ones
        let swaggerPaths = existingSwaggerConfig.paths || {};
        let swaggerSchemas = existingSwaggerConfig.components?.schemas || {};

        schema.forEach(entity => {
            const sanitizedEntityName = `${sanitizedSchemaName}_${sanitizeName(entity.name)}`;
            const entityFilePath = path.join(apiFolderPath, `${sanitizedEntityName}.js`);

            // Fix: Check if properties exist at the root level, if not, check in definitions
            let properties = entity.jsonSchema.properties;
            if (!properties || Object.keys(properties).length === 0) {
                // Try to get properties from definitions
                if (entity.jsonSchema.definitions && 
                    entity.jsonSchema.definitions[entity.name] && 
                    entity.jsonSchema.definitions[entity.name].properties) {
                    properties = entity.jsonSchema.definitions[entity.name].properties;
                }
            }

            // Ensure properties is not undefined
            properties = properties || {};
            
            // Fix: Define columns and placeholders as variables in the generated code
            const columnsArray = Object.keys(properties);
            const placeholdersArray = columnsArray.map(() => '?');
            
            const routeDefinitions = `
            const express = require('express');
            const db = require('../db');
            const router = express.Router();

            router.post('/', (req, res) => {
                // Get column names from the request body that are actually present
                const availableColumns = [${columnsArray.map(col => `'${col}'`).join(', ')}];
                const columnsToInsert = availableColumns.filter(col => req.body[col] !== undefined);
                
                // Check if there are any columns to insert
                if (columnsToInsert.length === 0) {
                    return res.status(400).send({
                        error: 'No valid columns to insert',
                        availableColumns: availableColumns,
                        receivedBody: req.body
                    });
                }
                
                // Create variables for the SQL query
                const columns = columnsToInsert.join(', ');
                const placeholders = columnsToInsert.map(() => '?').join(', ');
                const values = columnsToInsert.map(col => req.body[col]);

                const insertQuery = \`INSERT INTO ${sanitizedEntityName} (\${columns}) VALUES (\${placeholders})\`;
                
                // Log the query for debugging
                console.log('Executing query:', insertQuery, 'with values:', values);

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            error: err.message,
                            query: insertQuery,
                            values: values
                        });
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM ${sanitizedEntityName}';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            error: err.message,
                            query: selectQuery
                        });
                    }
                    res.send(rows);
                });
            });

            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM ${sanitizedEntityName} WHERE id = ?';

                db.get(selectQuery, [req.params.id], (err, row) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            error: err.message,
                            query: selectQuery,
                            values: [req.params.id]
                        });
                    }
                    if (!row) {
                        return res.status(404).send('Record not found');
                    }
                    res.send(row);
                });
            });

            router.put('/:id', (req, res) => {
                // Get column names from the request body that are actually present
                const availableColumns = [${columnsArray.map(col => `'${col}'`).join(', ')}];
                const columnsToUpdate = availableColumns.filter(col => req.body[col] !== undefined);
                
                // Check if there are any columns to update
                if (columnsToUpdate.length === 0) {
                    return res.status(400).send({
                        error: 'No valid columns to update',
                        availableColumns: availableColumns,
                        receivedBody: req.body
                    });
                }
                
                // Create variables for the SQL query
                const updates = columnsToUpdate.map(col => \`\${col} = ?\`).join(', ');
                const values = columnsToUpdate.map(col => req.body[col]);
                values.push(req.params.id);

                const updateQuery = \`UPDATE ${sanitizedEntityName} SET \${updates} WHERE id = ?\`;
                
                // Log the query for debugging
                console.log('Executing query:', updateQuery, 'with values:', values);

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            error: err.message,
                            query: updateQuery,
                            values: values
                        });
                    }
                    res.send('Record updated successfully');
                });
            });

            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM ${sanitizedEntityName} WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            error: err.message,
                            query: deleteQuery,
                            values: [req.params.id]
                        });
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

            // Add new paths and schemas to the existing ones
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

        // Update Swagger configuration with merged paths and schemas
        const updatedSwaggerConfig = {
            openapi: '3.0.0',
            info: {
                title: existingSwaggerConfig.info?.title || 'API Documentation',
                version: existingSwaggerConfig.info?.version || '1.0.0',
                description: `Documentation includes: ${schemaName} and other schemas`
            },
            paths: swaggerPaths,
            components: {
                schemas: swaggerSchemas
            }
        };

        writeSwaggerConfig(updatedSwaggerConfig);

        res.send('API endpoints synchronized and Swagger documentation updated successfully.');
    });
});

module.exports = router;