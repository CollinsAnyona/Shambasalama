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
app.use(express.json())

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

// Sample data for buyers and farmers
const buyers = [
    { id: 1, name: "John Doe", location: "Nairobi", crop: "Maize", quantity: 100, priceRange: [30, 50] },
    { id: 2, name: "Jane Smith", location: "Kisumu", crop: "Tomatoes", quantity: 200, priceRange: [40, 60] }
];

const farmers = [
    { id: 1, name: "Onyango", location: "Kisumu", crop: "Tomatoes", quantity: 150, price: 45 },
    { id: 2, name: "Mwangi", location: "Nairobi", crop: "Maize", quantity: 80, price: 35 }
];

// Matching algorithm
app.get('/match', (req, res) => {
    const matches = [];
    buyers.forEach(buyer => {
        farmers.forEach(farmer => {
            if (
                buyer.crop === farmer.crop &&
                buyer.quantity <= farmer.quantity &&
                buyer.priceRange[0] <= farmer.price &&
                buyer.priceRange[1] >= farmer.price &&
                buyer.location === farmer.location
            ) {
                matches.push({ buyer, farmer });
            }
        });
    });
    res.json(matches);
});

// Simple chat endpoint for demonstration
let messages = [];

app.post('/send-message', (req, res) => {
    const { sender, recipient, content } = req.body;
    messages.push({ sender, recipient, content, timestamp: new Date() });
    res.json({ status: 'Message sent!', messages });
});

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
