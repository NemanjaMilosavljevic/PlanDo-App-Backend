const db = require("../util/database");

//query za filtering
exports.filterByQuery = (month, priority, userId) => {
  if (month == "All" && priority == "All") {
    return db.execute(
      `SELECT t.id, t.created_on, t.priority, t.status, t.title, t.description, t.visibleId, t.due
        FROM tasks AS t LEFT JOIN users AS u ON u.id = t.user_id
        WHERE t.user_id = ? 
      `,
      [userId]
    );
  } else if (month == "All") {
    return db.execute(
      `SELECT t.id, t.created_on, t.priority, t.status, t.title, t.description, t.visibleId, t.due
        FROM tasks AS t LEFT JOIN users AS u ON u.id = t.user_id
        WHERE t.user_id = ?  AND t.priority = ?          
      `,
      [userId, priority]
    );
  } else if (priority == "All") {
    return db.execute(
      `SELECT t.id, t.created_on, t.priority, t.status, t.title, t.description, t.visibleId, t.due
        FROM tasks AS t LEFT JOIN users AS u ON u.id = t.user_id
        WHERE t.user_id = ? AND MONTH(t.created_on) = ?
      `,
      [userId, month]
    );
  } else {
    return db.execute(
      `SELECT t.id, t.created_on, t.priority, t.status, t.title, t.description, t.visibleId, t.due
        FROM tasks AS t LEFT JOIN users AS u ON u.id = t.user_id
        WHERE t.user_id = ? AND 
              t.priority = ? AND
              MONTH(t.created_on) = ?
      `,
      [userId, priority, month]
    );
  }
};
