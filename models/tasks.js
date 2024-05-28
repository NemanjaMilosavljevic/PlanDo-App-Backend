const db = require("../util/database");
const taskQueries = require("../queries/tasks");
const analitycsQueries = require("../queries/analitycs");

db.execute(
  `CREATE TABLE IF NOT EXISTS tasks(
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      priority ENUM('Important', 'Not-important'),
      due DATE NOT NULL,
      status ENUM('To Do', 'In progress', 'Done'),
      visibleId VARCHAR(50) NOT NULL,
      user_id INT,
      created_on DATE DEFAULT (CURRENT_DATE),
      order_index INT DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX month_priority (created_on, priority)
  )
  `
);

module.exports = class Task {
  constructor(title, description, priority, due, status, visibleId, userId) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.due = due;
    this.status = status;
    this.visibleId = visibleId;
    this.userId = userId;
  }

  save() {
    return taskQueries.createTaskQuery(
      this.title,
      this.description,
      this.priority,
      this.due,
      this.status,
      this.visibleId,
      this.userId
    );
  }

  static saveToUsersTasks(taskId, userId) {
    return taskQueries.createUsersTasksQuery(taskId, userId);
  }

  static fetchAll(userId) {
    return taskQueries.getTasksQuery(userId);
  }

  static delete(taskId) {
    return taskQueries.deleteTaskQuery(taskId);
  }

  static update(updatedTask, taskId) {
    return taskQueries.updateTaskQuery(updatedTask, taskId);
  }

  static updateDragAndDrop(status, taskId) {
    return taskQueries.updateStatusOnDnD(status, taskId);
  }

  static filterBy(month, priority, userId) {
    return analitycsQueries.filterByQuery(month, priority, userId);
  }

  static addOrderIndex(orderIndex, taskId) {
    return taskQueries.addOrderIndexForTasks(orderIndex, taskId);
  }
};
