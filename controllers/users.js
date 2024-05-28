const User = require("../models/users");
const auth = require("../util/auth");
const io = require("../socket");

exports.getUsers = (req, res, next) => {
  User.fetchAll()
    .then((result) => {
      return res.status(200).json(result[0]);
    })
    .catch((err) => next(new Error(err)));
};

exports.createUser = async (req, res, next) => {
  const hashedPassword = await auth.hashPassword(req.body.password);
  const role = req.body.isUserAdmin ? "admin" : "user";

  let newUser;

  User.isExisting(req.body.email)
    .then((isUserExist) => {
      if (isUserExist) {
        throw new Error("User already exists!");
      }
      newUser = new User(req.body.email, hashedPassword, role);

      return newUser.save();
    })
    .then((result) => {
      io.getIO().emit("users", {
        action: "create",
        message: `New account with id ${result[0].insertId} and role ${role} was created!`,
        user: { ...newUser, id: result[0].insertId },
      });

      return res
        .status(201)
        .json({ message: "New user was succesfully created!" });
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
};

exports.deleteUser = (req, res, next) => {
  const currentUser = res.locals.userId;
  const currentUserRole = res.locals.role;
  const userId = +req.params.userId;
  const userRole = req.body.role;

  if (currentUser === userId) {
    throw new Error("You are not allowed to delete your account!");
  }

  if (
    currentUserRole === "user" ||
    (currentUserRole === "admin" && userRole === "admin")
  ) {
    throw new Error(
      "You are only allowed to delete users with lower role then yourself!"
    );
  }

  User.delete(userId)
    .then((result) => {
      if (result === undefined) {
        throw new Error(
          "User could not be deleted because of unexpected error"
        );
      }

      //websocket- salje se notifikacija svim userima da je user izbrisan
      io.getIO().emit("users", {
        action: "delete",
        deletedUser: userId,
        message: `User with ID ${userId} was deleted!`,
      });

      return res.status(200).json({
        message: `User with ID ${userId} was deleted!`,
        userId: userId,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
};

exports.loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let userId;
  let role;
  let oldHashedPassword;

  User.isExisting(req.body.email)
    .then((userData) => {
      if (userData === undefined) {
        throw new Error("User dont exist in database, please sign up first!");
      }

      userId = userData.id;
      role = userData.role;
      oldHashedPassword = userData.password;

      return User.authenticate(password, oldHashedPassword);
    })
    .then((isAuthenticated) => {
      if (!isAuthenticated) {
        throw new Error("Access denied! Unauthenticated user!");
      }
      const token = auth.createToken({
        data: { email: email, id: userId, role: role },
      });

      const tokenData = auth.decodeToken(token);

      return res
        .status(200)
        .setHeader("Authorization", `Bearer ${token}`)
        .json({
          token: token,
          role: role,
          email: email,
          userId: userId,
          expiresIn: tokenData.exp - tokenData.iat,
          message: "User was succesfully authenticated!",
        });
    })
    .catch((err) => next(new Error(err)));
};

exports.changePassword = (req, res, next) => {
  const userEmail = res.locals.userEmail;
  const userId = res.locals.userId;
  let hashedPassword;

  User.getPassword(userEmail)
    .then((data) => {
      const oldPassword = data[0][0].password;
      return auth.verifyPassword(req.body.password, oldPassword);
    })
    .then((isNewPasswordSameAsOld) => {
      if (isNewPasswordSameAsOld) {
        throw new Error("Same password is not allowed!");
      }

      hashedPassword = auth.hashPassword(req.body.password);
      return hashedPassword;
    })
    .then((hashedPassword) => {
      return User.saveNewPassword(hashedPassword, userId);
    })
    .then((data) => {
      return res
        .status(200)
        .json({ message: "You succesfully change password" });
    })
    .catch((err) => {
      next(new Error(err));
    });
};
