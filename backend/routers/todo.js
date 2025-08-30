const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        const sql = "SELECT id, todo, completed FROM todo WHERE user_id = ?";
        const [todos] = await db.query(sql, [userId]);
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).send('Konten todo tidak boleh kosong.');
    }

    try {
        const userId = req.user.userId;
        const sql = "INSERT INTO todo (todo, user_id) VALUES (?, ?)";
        await db.query(sql, [todo, userId]);
        
        const [updatedTodos] = await db.query("SELECT id, todo, completed FROM todo WHERE user_id = ?", [userId]);

        req.app.locals.broadcastUpdate(userId, updatedTodos);

        res.status(201).json(updatedTodos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.userId;

        const sql = "DELETE FROM todo WHERE id = ? AND user_id = ?";
        const [result] = await db.query(sql, [todoId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Todo tidak ditemukan atau Anda tidak punya akses.');
        }

        const [updatedTodos] = await db.query("SELECT id, todo, completed FROM todo WHERE user_id = ?", [userId]);

        req.app.locals.broadcastUpdate(userId, updatedTodos);

        res.json(updatedTodos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;