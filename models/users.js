const userQueries = require("../queries/users");
const auth = require("../util/auth");

module.exports = class User {
  constructor(email, password, role) {
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static createUsersTable() {
    return userQueries.createUserTable();
  }

  static createTableUsersTasks() {
    return userQueries.createUsersTasksTable();
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
