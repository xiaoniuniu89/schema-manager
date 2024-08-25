
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/boardGame:
             *   get:
             *     summary: Retrieve a list of boardGames
             *     responses:
             *       200:
             *         description: A list of boardGames
             *   post:
             *     summary: Create a new boardGame
             *     responses:
             *       201:
             *         description: The created boardGame
             */

            router.post('/', (req, res) => {
                const columns = ["name","price"].join(', ');
                const placeholders = ["?","?"].join(', ');
                const values = [req.body['name'], req.body['price']];

                const insertQuery = `INSERT INTO boardGame (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/boardGame:
             *   get:
             *     summary: Retrieve a list of boardGames
             *     responses:
             *       200:
             *         description: A list of boardGames
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM boardGame';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/boardGame/{id}:
             *   get:
             *     summary: Retrieve a single boardGame by ID
             *     responses:
             *       200:
             *         description: A single boardGame
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM boardGame WHERE id = ?';

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
             * /api/boardGame/{id}:
             *   put:
             *     summary: Update an existing boardGame
             *     responses:
             *       200:
             *         description: The updated boardGame
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?","\"price\" = ?"].join(', ');
                const values = [req.body['name'], req.body['price']];
                values.push(req.params.id);

                const updateQuery = `UPDATE boardGame SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/boardGame/{id}:
             *   delete:
             *     summary: Delete an existing boardGame
             *     responses:
             *       200:
             *         description: The deleted boardGame
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM boardGame WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            