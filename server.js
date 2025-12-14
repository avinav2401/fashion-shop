const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve static files

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

let db;

async function initDB() {
    try {
        db = await open({
            filename: 'fashion_store.db',
            driver: sqlite3.Database
        });

        console.log('Connected to SQLite database');

        // Initialize tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                businessName TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                seller_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                stock INTEGER NOT NULL,
                category TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (seller_id) REFERENCES users(id)
            );
        `);
        console.log('Database tables initialized');

    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}

initDB();

// Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Endpoints
app.post('/api/register', async (req, res) => {
    const { email, password, role, businessName } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.run(
            'INSERT INTO users (email, password, role, businessName) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, role, businessName]
        );

        const token = jwt.sign({ id: result.lastID, role }, JWT_SECRET);
        res.json({ token, role, userId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
        res.json({ token, role: user.role, userId: user.id });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Product Endpoints
app.get('/api/products', async (req, res) => {
    const { seller_id } = req.query;
    try {
        let sql = 'SELECT * FROM products';
        let params = [];
        if (seller_id) {
            sql += ' WHERE seller_id = ?';
            params.push(seller_id);
        }
        sql += ' ORDER BY created_at DESC';

        const products = await db.all(sql, params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') return res.sendStatus(403);

    const { name, description, price, stock, category } = req.body;
    try {
        await db.run(
            'INSERT INTO products (seller_id, name, description, price, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, name, description, price, stock, category]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error adding product' });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'seller') return res.sendStatus(403);

    try {
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if (product.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this product' });
        }

        await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const products = await db.all(
            `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`,
            [`%${q}%`, `%${q}%`]
        );
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});