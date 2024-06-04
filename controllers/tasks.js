const Task = require("../models/tasks");

exports.getTasks = (req, res, next) => {
  Task.fetchAll(res.locals.userId)
    .then((tasks) => {
      return res.status(200).json(tasks[0]);
    })
    .catch((err) => next(new Error(err)));
};

exports.createTask = (req, res, next) => {
  const newTask = new Task(
    req.body.title,
    req.body.description,
    req.body.priority,
    new Date(req.body.due),
    req.body.status,
    req.body.visibleId,
    res.locals.userId
  );

  let taskId;

  newTask
    .save()
    .then((result) => {
      taskId = result[0].insertId;
      return Task.saveToUsersTasks(result[0].insertId, res.locals.userId);
    })
    .then((data) => {
      return res.status(201).json({
        message: "Task was succesfully created!",
        taskId: taskId,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;

  Task.delete(taskId)
    .then((result) => {
      return res.status(200).json({ message: "Task was succesfully deleted!" });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.updateTask = (req, res, next) => {
  const updatedTask = req.body;
  const taskId = req.params.taskId;

  Task.update(updatedTask, taskId)
    .then((modifyTask) => {
      return res.status(200).json({
        message: "Task was succesfully updated!",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.updateTaskWheneDragTask = (req, res, next) => {
  const updatedStatus = req.body.status;
  const taskId = req.body.updatedTask.id;
  const tasksWithOrderIndex = req.body.tasksWithOrderIndex;

  Task.updateDragAndDrop(updatedStatus, taskId)
    .then((modifyTask) => {
      tasksWithOrderIndex.forEach((task) => {
        return Task.addOrderIndex(task.orderIndex, task.id);
      });
    })
    .then((data) => {
      return res.status(200).json({
        message: "Task status was succesfully updated!",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};
