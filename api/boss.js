
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/boss:
             *   get:
             *     summary: Retrieve a list of bosss
             *     responses:
             *       200:
             *         description: A list of bosss
             *   post:
             *     summary: Create a new boss
             *     responses:
             *       201:
             *         description: The created boss
             */

            router.post('/', (req, res) => {
                const columns = ["name","email"].join(', ');
                const placeholders = ["?","?"].join(', ');
                const values = [req.body['name'], req.body['email']];

                const insertQuery = `INSERT INTO boss (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/boss:
             *   get:
             *     summary: Retrieve a list of bosss
             *     responses:
             *       200:
             *         description: A list of bosss
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM boss';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/boss/{id}:
             *   get:
             *     summary: Retrieve a single boss by ID
             *     responses:
             *       200:
             *         description: A single boss
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM boss WHERE id = ?';

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

            /**
             * @swagger
             * /api/boss/{id}:
             *   put:
             *     summary: Update an existing boss
             *     responses:
             *       200:
             *         description: The updated boss
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?","\"email\" = ?"].join(', ');
                const values = [req.body['name'], req.body['email']];
                values.push(req.params.id);

                const updateQuery = `UPDATE boss SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/boss/{id}:
             *   delete:
             *     summary: Delete an existing boss
             *     responses:
             *       200:
             *         description: The deleted boss
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM boss WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            