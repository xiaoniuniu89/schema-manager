
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/Person:
             *   get:
             *     summary: Retrieve a list of Persons
             *     responses:
             *       200:
             *         description: A list of Persons
             *   post:
             *     summary: Create a new Person
             *     responses:
             *       201:
             *         description: The created Person
             */

            router.post('/', (req, res) => {
                const columns = ["Age"].join(', ');
                const placeholders = ["?"].join(', ');
                const values = [req.body['Age']];

                const insertQuery = `INSERT INTO Person (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data');
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/Person:
             *   get:
             *     summary: Retrieve a list of Persons
             *     responses:
             *       200:
             *         description: A list of Persons
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM Person';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/Person/{id}:
             *   get:
             *     summary: Retrieve a single Person by ID
             *     responses:
             *       200:
             *         description: A single Person
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM Person WHERE id = ?';

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
             * /api/Person/{id}:
             *   put:
             *     summary: Update an existing Person
             *     responses:
             *       200:
             *         description: The updated Person
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"Age\" = ?"].join(', ');
                const values = [req.body['Age']];
                values.push(req.params.id);

                const updateQuery = `UPDATE Person SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/Person/{id}:
             *   delete:
             *     summary: Delete an existing Person
             *     responses:
             *       200:
             *         description: The deleted Person
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM Person WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            