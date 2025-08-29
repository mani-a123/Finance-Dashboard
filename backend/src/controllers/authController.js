import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function register(req, res) {
    const { name, email, password } = req.body;
  
    try {
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
  
      // Check if email is already taken
      const checkEmail = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
      if (checkEmail.rows.length > 0) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
  
      // Validate password length (example: min 8 characters)
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
  
      // Hash the password
      const hashed = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
        [name, email, hashed]
      );
      
      // Return success message and user data (id, email)
      res.json({
        message: 'User registered successfully',
        user: result.rows[0]
      });
  
    } catch (err) {
      if (err.code === '23505') { // Unique constraint violation (PostgreSQL)
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.log(err);
      res.status(400).json({ error: 'Something went wrong' });
    }
  }

  export async function login(req, res) {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const user = result.rows[0];
  
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT secret is not configured' });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET
      );
      
  
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  }