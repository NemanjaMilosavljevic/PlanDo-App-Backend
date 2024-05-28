const mysql2 = require("mysql2");

const connectionPool = mysql2.createPool({
  host: "localhost",
  user: "root",
  database: "rest_project",
  password: "Nemanja1.",
});

module.exports = connectionPool.promise();
