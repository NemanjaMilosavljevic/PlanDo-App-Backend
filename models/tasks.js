const taskQueries = require("../queries/tasks");
const analitycsQueries = require("../queries/analitycs");

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

  static createTable() {
    return taskQueries.createTaskTable();
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

  static filterByMonthAndPriority(month, priority, userId) {
    return analitycsQueries.filterTasks(month, priority, userId);
  }

  static addOrderIndex(orderIndex, taskId) {
    return taskQueries.addOrderIndexForTasks(orderIndex, taskId);
  }
};
