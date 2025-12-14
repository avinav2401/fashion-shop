const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');

async function seedUser() {
    try {
        const db = await open({
            filename: 'fashion_store.db',
            driver: sqlite3.Database
        });
        console.log('Connected to SQLite database.');

        // User details from request
        const email = 'avinav@gmail.com';
        const passwordPlain = '222';
        const role = 'customer'; // Maps to "consumer"
        const businessName = null; // Consumers don't have business names

        const passwordHash = await bcrypt.hash(passwordPlain, 10);

        // Check if user exists
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (existing) {
            // Update existing user
            await db.run(
                'UPDATE users SET password = ?, role = ?, businessName = ? WHERE email = ?',
                [passwordHash, role, businessName, email]
            );
            console.log(`User ${email} updated successfully as ${role}.`);
        } else {
            // Insert new user
            await db.run(
                'INSERT INTO users (email, password, role, businessName) VALUES (?, ?, ?, ?)',
                [email, passwordHash, role, businessName]
            );
            console.log(`User ${email} created successfully as ${role}.`);
        }

    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seedUser();
