const express = require("express");
const tasksController = require("../controllers/tasks");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

router.get("/tasks", isAuth, tasksController.getTasks);

router.post("/create-task", isAuth, tasksController.createTask);

router.delete("/tasks/edit/:taskId", isAuth, tasksController.deleteTask);

router.patch("/tasks", isAuth, tasksController.updateTaskWheneDragTask);

router.patch("/tasks/edit/:taskId", isAuth, tasksController.updateTask);

module.exports = router;
