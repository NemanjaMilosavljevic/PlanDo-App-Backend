const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const analitycsController = require("../controllers/analitycs");

router.get("/analitycs", isAuth, analitycsController.filterTasks);

module.exports = router;
