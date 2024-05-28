const Task = require("../models/tasks");

exports.filterTasks = (req, res, next) => {
  const monthFilter = req.query.month;
  const priorityFilter = req.query.priority;
  const userId = res.locals.userId;

  Task.filterBy(monthFilter, priorityFilter, userId)
    .then((filterTasks) => {
      return res.status(200).json({
        filteredTasks: filterTasks[0],
        message: "You succesfully filter tasks!",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};
