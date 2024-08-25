
            const express = require('express');
            const db = require('../db'); // Assuming you have a db.js file for database operations
            const router = express.Router();

            /**
             * @swagger
             * /api/student:
             *   get:
             *     summary: Retrieve a list of students
             *     responses:
             *       200:
             *         description: A list of students
             *   post:
             *     summary: Create a new student
             *     responses:
             *       201:
             *         description: The created student
             */

            router.post('/', (req, res) => {
                const columns = ["name","grade","email"].join(', ');
                const placeholders = ["?","?","?"].join(', ');
                const values = [req.body['name'], req.body['grade'], req.body['email']];

                const insertQuery = `INSERT INTO student (${columns}) VALUES (${placeholders})`;

                db.run(insertQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error inserting data: ' + err);
                    }
                    res.status(201).send({ id: this.lastID });
                });
            });

            /**
             * @swagger
             * /api/student:
             *   get:
             *     summary: Retrieve a list of students
             *     responses:
             *       200:
             *         description: A list of students
             */
            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM student';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

            /**
             * @swagger
             * /api/student/{id}:
             *   get:
             *     summary: Retrieve a single student by ID
             *     responses:
             *       200:
             *         description: A single student
             */
            router.get('/:id', (req, res) => {
                const selectQuery = 'SELECT * FROM student WHERE id = ?';

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
             * /api/student/{id}:
             *   put:
             *     summary: Update an existing student
             *     responses:
             *       200:
             *         description: The updated student
             */
            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?","\"grade\" = ?","\"email\" = ?"].join(', ');
                const values = [req.body['name'], req.body['grade'], req.body['email']];
                values.push(req.params.id);

                const updateQuery = `UPDATE student SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully.');
                });
            });

            /**
             * @swagger
             * /api/student/{id}:
             *   delete:
             *     summary: Delete an existing student
             *     responses:
             *       200:
             *         description: The deleted student
             */
            router.delete('/:id', (req, res) => {
                const deleteQuery = 'DELETE FROM student WHERE id = ?';

                db.run(deleteQuery, [req.params.id], function(err) {
                    if (err) {
                        return res.status(500).send('Error deleting data');
                    }
                    res.send('Record deleted successfully.');
                });
            });

            module.exports = router;
            