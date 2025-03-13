
            const express = require('express');
            const db = require('../db');
            const router = express.Router();

            router.post('/', (req, res) => {
                // Get column names from the request body that are actually present
                const availableColumns = ['title', 'content', 'tag', 'id'];
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

                const insertQuery = `INSERT INTO swr_post_swr_post (${columns}) VALUES (${placeholders})`;
                
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
                const selectQuery = 'SELECT * FROM swr_post_swr_post';

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
                const selectQuery = 'SELECT * FROM swr_post_swr_post WHERE id = ?';

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
                const availableColumns = ['title', 'content', 'tag', 'id'];
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
                const updates = columnsToUpdate.map(col => `${col} = ?`).join(', ');
                const values = columnsToUpdate.map(col => req.body[col]);
                values.push(req.params.id);

                const updateQuery = `UPDATE swr_post_swr_post SET ${updates} WHERE id = ?`;
                
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
                const deleteQuery = 'DELETE FROM swr_post_swr_post WHERE id = ?';

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
            