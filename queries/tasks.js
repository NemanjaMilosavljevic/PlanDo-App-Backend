const db = require("../util/database");

exports.createTaskQuery = (
  title,
  description,
  priority,
  due,
  status,
  visibleId,
  userId
) => {
  return db.execute(
    `INSERT INTO tasks (title, description, priority, due, status, visibleId, user_id) 
  VALUES (?, ?, ?, ?, ?, ?, ?) 
  `,
    [title, description, priority, due, status, visibleId, userId]
  );
};

exports.createUsersTasksQuery = (taskId, userId) => {
  return db.execute(
    `INSERT INTO users_tasks (task_id, user_id) 
  VALUES (?, ?) 
  `,
    [taskId, userId]
  );
};

exports.getTasksQuery = (userId) => {
  return db.execute(
    `SELECT t.id, t.title, t.description, t.priority, t.due, t.status, t.visibleId, t.created_on
    FROM tasks AS t LEFT JOIN users AS u ON u.id = t.user_id 
    WHERE t.user_id = ? 
    ORDER BY order_index`,
    [userId]
  );
};

exports.deleteTaskQuery = (taskId) => {
  return db.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);
};

exports.updateTaskQuery = (
  { title, description, priority, due, status },
  taskId
) => {
  return db.execute(
    `UPDATE tasks SET title = ?, description = ?, priority = ?, due = ?, status = ? WHERE id = ?`,
    [title, description, priority, due, status, taskId]
  );
};

// update task on drag and drop
exports.updateStatusOnDnD = (status, taskId) => {
  return db.execute(`UPDATE tasks SET  status = ? WHERE id = ?`, [
    status,
    taskId,
  ]);
};

exports.addOrderIndexForTasks = (orderIndex, taskId) => {
  return db.execute(
    `UPDATE tasks 
     SET order_index = ? 
     WHERE id = ?`,
    [orderIndex, taskId]
  );
};
