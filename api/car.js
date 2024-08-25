
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/car:
             *   get:
             *     summary: Retrieve a list of cars
             *     responses:
             *       200:
             *         description: A list of cars
             *   post:
             *     summary: Create a new car
             *     responses:
             *       201:
             *         description: The created car
             */

            router.post('/', (req, res) => {
                const columns = ["make","model"].join(', ');
                const placeholders = ["?","?"].join(', ');
                const values = [req.body['make'], req.body['model']];

                const insertQuery = `INSERT INTO car (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/car:
             *   get:
             *     summary: Retrieve a list of cars
             *     responses:
             *       200:
             *         description: A list of cars
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM car';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/car/{id}:
             *   get:
             *     summary: Retrieve a single car by ID
             *     responses:
             *       200:
             *         description: A single car
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM car WHERE id = ?';

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
             * /api/car/{id}:
             *   put:
             *     summary: Update an existing car
             *     responses:
             *       200:
             *         description: The updated car
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"make\" = ?","\"model\" = ?"].join(', ');
                const values = [req.body['make'], req.body['model']];
                values.push(req.params.id);

                const updateQuery = `UPDATE car SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/car/{id}:
             *   delete:
             *     summary: Delete an existing car
             *     responses:
             *       200:
             *         description: The deleted car
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM car WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            