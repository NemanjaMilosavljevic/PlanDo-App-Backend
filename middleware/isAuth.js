const auth = require("../util/auth");

module.exports = (req, res, next) => {
  const userToken = req.get("Authorization").split(" ")[1];
  const userPayload = auth.decodeToken(userToken)?.data;

  auth.validateToken(userToken);

  if (!userToken) {
    return res.redirect("/register");
  }
  if (req.path.includes("/admin") && userPayload.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized user!" });
  }

  res.locals.userId = userPayload.id;
  res.locals.userEmail = userPayload.email;
  res.locals.role = userPayload.role;

  next();
};
