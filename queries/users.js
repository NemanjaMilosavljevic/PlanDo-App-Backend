const db = require("../util/database");

exports.createUserTable = () => {
  return db.execute(
    `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role ENUM('user', 'admin')
  )
`
  );
};

exports.createUsersTasksTable = () => {
  return db.execute(
    `CREATE TABLE IF NOT EXISTS users_tasks (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      task_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `
  );
};

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
