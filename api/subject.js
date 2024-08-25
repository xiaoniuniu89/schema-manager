
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/subject:
             *   get:
             *     summary: Retrieve a list of subjects
             *     responses:
             *       200:
             *         description: A list of subjects
             *   post:
             *     summary: Create a new subject
             *     responses:
             *       201:
             *         description: The created subject
             */

            router.post('/', (req, res) => {
                const columns = ["name","id","teacher"].join(', ');
                const placeholders = ["?","?","?"].join(', ');
                const values = [req.body['name'], req.body['id'], req.body['teacher']];

                const insertQuery = `INSERT INTO subject (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/subject:
             *   get:
             *     summary: Retrieve a list of subjects
             *     responses:
             *       200:
             *         description: A list of subjects
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM subject';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/subject/{id}:
             *   get:
             *     summary: Retrieve a single subject by ID
             *     responses:
             *       200:
             *         description: A single subject
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM subject WHERE id = ?';

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
             * /api/subject/{id}:
             *   put:
             *     summary: Update an existing subject
             *     responses:
             *       200:
             *         description: The updated subject
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?","\"id\" = ?","\"teacher\" = ?"].join(', ');
                const values = [req.body['name'], req.body['id'], req.body['teacher']];
                values.push(req.params.id);

                const updateQuery = `UPDATE subject SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/subject/{id}:
             *   delete:
             *     summary: Delete an existing subject
             *     responses:
             *       200:
             *         description: The deleted subject
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM subject WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            