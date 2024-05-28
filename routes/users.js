const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

router.get("/admin", isAuth, usersController.getUsers);

router.post("/register", usersController.createUser);

router.post("/login", usersController.loginUser);

router.delete("/admin/:userId", isAuth, usersController.deleteUser);

router.post("/change-password", isAuth, usersController.changePassword);

module.exports = router;
