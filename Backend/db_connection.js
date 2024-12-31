const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//     user: 'postgres',          // Replace with your PostgreSQL username
//     host: 'localhost',         // Database host
//     database: 'postgres',  // Database name
//     password: 'admin',  // Ensure this is a string
//     port: 5432,                // Default PostgreSQL port
//   });

// pool.connect()
//   .then(client => {
//     console.log('Connected to the database');
//     client.release();
//   })
//   .catch(err => {
//     console.error('Database connection error:', err.stack);
//   });
// Use a connection pool for better connection management

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:tD4lsLQwMEk2@ep-bitter-bread-a58wbm8l.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to the database");
    client.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });

module.exports = pool;