const db = require("../util/database");

exports.getUsersQuery = () => {
  return db.execute(`SELECT * FROM users`);
};

exports.createUserQuery = (email, password, role) => {
  return db.execute(
    `INSERT INTO users (email, password, role) 
    VALUES (?, ?, ?) 
    `,
    [email, password, role]
  );
};

exports.deleteUserQuery = (userId) => {
  return db.execute(`DELETE FROM users WHERE id = ?`, [userId]);
};

exports.getUser = (email) => {
  return db.execute(
    `SELECT email, id, password, role FROM users WHERE email = ?`,
    [email]
  );
};

exports.savePassword = (password, userId) => {
  return db.execute(`UPDATE users SET password = ? WHERE id = ?`, [
    password,
    userId,
  ]);
};

exports.getPasswordFromDB = (email) => {
  return db.execute(`SELECT password FROM users WHERE email = ?`, [email]);
};
