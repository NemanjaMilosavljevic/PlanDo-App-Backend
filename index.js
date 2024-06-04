const express = require("express");

const bodyParser = require("body-parser");
const app = express();

const Task = require("./models/tasks");
const User = require("./models/users");

app.use(bodyParser.json());

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const analitycsRoutes = require("./routes/analitycs");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_APP_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use(userRoutes);
app.use(taskRoutes);
app.use(analitycsRoutes);

app.use((error, req, res, next) => {
  if (error.message === "Unauthorized user!") {
    res.status(403).json({ errorMessage: "Unauthorized user!" });
    return;
  }

  res.status(400).json({ errorMessage: error.message });
});

User.createUsersTable()
  .then((res) => {
    return Task.createTable();
  })
  .then((res) => {
    return User.createTableUsersTasks();
  })
  .then((res) => {
    const server = app.listen(5000);
    const io = require("./socket").init(server);
  })
  .catch((err) => {
    next(new Error(err));
  });
