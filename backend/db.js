const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "climate",
  password: "123",
  port: 5433,
});

module.exports = pool;