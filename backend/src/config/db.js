// backend/src/config/db.js
import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "0000",
  database: process.env.DB_NAME || "parqueadero",
  port: process.env.DB_PORT || 5432,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Render exige SSL
    : false, // local sin SSL
});

export default pool;
