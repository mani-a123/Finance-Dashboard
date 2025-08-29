import pkg from 'pg';
import dotenv from 'dotenv';
//console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL);
// Load environment variables from .env

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//adjust the path if your .env is not in backend/
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment');
  } else {
    //console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL);
  }
  
// Destructure Pool from pg
const { Pool } = pkg;

//console.log('Database URL:', process.env.DATABASE_URL); // This should log the entire URL correctly


// Create a new Pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  
});

// Try to connect to PostgreSQL and log any errors
pool.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

// Export pool for use in other parts of the app
export default pool;
