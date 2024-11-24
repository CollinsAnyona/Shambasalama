const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();	
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const cors = require('cors');

// Middleware	
app.use(bodyParser.json());
app.use(cors());

// Database
const db = new sqlite3.Database(':memory:');

// Create user table
db.serialize(() => {
    // User table
    db.run(
        `CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEST UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`
    );

    // Market prices table
    db.run(
        `CREATE TABLE market (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop TEXT NOT NULL,
            price REAL NOT NULL,
            market TEXT NOT NULL
        )`
    );

    // Buyers table
    db.run(
        `CREATE TABLE buyers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            contact TEXT NOT NULL
        )`
    );

    // Produce postings table
    db.run(
        `CREATE TABLE produce (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cropName TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            location TEXT NOT NULL
        )`
    );
});


// Secret key for JWT
const SECRET_KEY = 'shamba-salama';

// Routes
app.post('/api/auth/register', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required.'});
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to user database
        db.run(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [username, hashedPassword],
            function(err) {
                if (err) {
                    return res.status(400).json({error: 'Username already exists.'});
                }
                res.status(201).json({message: 'User registered successfully.'});
            }
        );
    }catch (error) {
    res.status(500).json({error: 'Internal server error.'});
    }
});

app.post('/api/auth/login', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required.'});
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async ( err, user) => {
        if (err || !user) {
            return res.status(401).json({error: 'Invalid username or password.'});
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({error: 'Invalid username or password.'});
        }

        // Generate token
        const token = jwt.sign({id: user.id, username: user.username}, SECRET_KEY, {expiresIn: '1h'});
        res.json({message: 'Login successful.', token});
    });
});

// Market routes
app.get('/api/market-prices', (req, res) => {
    db.all(`SELECT * FROM market`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        res.json(rows);
    });
});

app.get('/api/buyers', (req, res) => {
    db.all(`SELECT * FROM buyers`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        res.json(rows);
    });
});

app.post('/api/post-produce', (req, res) => {
    const { cropName, quantity, location } = req.body;

    if (!cropName || !quantity || !location) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.run(
        `INSERT INTO produce (cropName, quantity, location) VALUES (?, ?, ?)`,
        [cropName, quantity, location],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to save produce.' });
            }
            res.status(201).json({ message: 'Produce posted successfully.' });
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
