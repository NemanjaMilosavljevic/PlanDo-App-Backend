const db = require("../util/database");
const userQueries = require("../queries/users");
const auth = require("../util/auth");

db.execute(
  `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role ENUM('user', 'admin')
  )
`
);

db.execute(
  `CREATE TABLE IF NOT EXISTS users_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    task_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  )
`
);

module.exports = class User {
  constructor(email, password, role) {
    this.email = email;
    this.password = password;
    this.role = role;
  }

  save() {
    return userQueries.createUserQuery(this.email, this.password, this.role);
  }

  static fetchAll() {
    return userQueries.getUsersQuery();
  }

  static delete(userId) {
    return userQueries.deleteUserQuery(userId);
  }

  static async isExisting(userEmail) {
    const existingUser = (await userQueries.getUser(userEmail))[0][0];

    return existingUser;
  }

  static async authenticate(password, oldHashedPassword) {
    const isAuthenticated = await auth.verifyPassword(
      password,
      oldHashedPassword
    );

    return isAuthenticated;
  }

  static saveNewPassword(password, userId) {
    return userQueries.savePassword(password, userId);
  }

  static getPassword(email) {
    return userQueries.getPasswordFromDB(email);
  }
};
