
            const express = require('express');
            const db = require('../db');
            const router = express.Router();

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

            router.get('/', (req, res) => {
                const selectQuery = 'SELECT * FROM subject';

                db.all(selectQuery, [], (err, rows) => {
                    if (err) {
                        return res.status(500).send('Error retrieving data');
                    }
                    res.send(rows);
                });
            });

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

            router.put('/:id', (req, res) => {
                const updates = ["\"name\" = ?","\"id\" = ?","\"teacher\" = ?"].join(', ');
                const values = [req.body['name'], req.body['id'], req.body['teacher']];
                values.push(req.params.id);

                const updateQuery = `UPDATE subject SET ${updates} WHERE id = ?`;

                db.run(updateQuery, values, function(err) {
                    if (err) {
                        return res.status(500).send('Error updating data');
                    }
                    res.send('Record updated successfully');
                });
            });

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
            