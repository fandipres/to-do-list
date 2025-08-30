const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = 'fandipres';

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username dan password diperlukan.');
    }

    try {
        const [existingUsers] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return res.status(409).send('Username sudah digunakan.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        await db.query(sql, [username, hashedPassword]);

        res.status(201).send('User berhasil dibuat.');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error pada server.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username dan password diperlukan.');
    }

    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        const [users] = await db.query(sql, [username]);

        if (users.length === 0) {
            return res.status(401).send('Username atau password salah.');
        }
        
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Username atau password salah.');
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error pada server.');
    }
});

module.exports = router;