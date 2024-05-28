const mysql2 = require("mysql2");

const connectionPool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

module.exports = connectionPool.promise();
