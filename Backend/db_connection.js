const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // Database host
  database: "postgres", // Database name
  password: "admin", // Ensure this is a string
  port: 5432, // Default PostgreSQL port
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
