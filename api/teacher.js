
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/teacher:
             *   get:
             *     summary: Retrieve a list of teachers
             *     responses:
             *       200:
             *         description: A list of teachers
             *   post:
             *     summary: Create a new teacher
             *     responses:
             *       201:
             *         description: The created teacher
             */

            router.post('/', (req, res) => {
                const columns = ["name"].join(', ');
                const placeholders = ["?"].join(', ');
                const values = [req.body['name']];

                const insertQuery = `INSERT INTO teacher (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/teacher:
             *   get:
             *     summary: Retrieve a list of teachers
             *     responses:
             *       200:
             *         description: A list of teachers
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM teacher';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/teacher/{id}:
             *   get:
             *     summary: Retrieve a single teacher by ID
             *     responses:
             *       200:
             *         description: A single teacher
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM teacher WHERE id = ?';

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
             * /api/teacher/{id}:
             *   put:
             *     summary: Update an existing teacher
             *     responses:
             *       200:
             *         description: The updated teacher
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?"].join(', ');
                const values = [req.body['name']];
                values.push(req.params.id);

                const updateQuery = `UPDATE teacher SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/teacher/{id}:
             *   delete:
             *     summary: Delete an existing teacher
             *     responses:
             *       200:
             *         description: The deleted teacher
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM teacher WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            