require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(403).json({ status: "error", message: "unauthorized" });
  }
  const token = req.headers["authorization"].replace("Bearer ", ""); // this is to remove the "Bearer" string in front of the token(string)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      // console.log("decoded");
      // console.log(decoded);
      const requestUser = {
        _id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
      };
      if (requestUser._id) {
        // here we mutate the request JSON, and add a new key: value to it
        req.user = requestUser;
      }
      next();
    } catch (error) {
      return res.status(401).send({
        status: "error",
        message: "authroised",
      });
    }
  } else {
    return res.status(403).json({
      status: "error",
      message: "missing token",
    });
  }
};

module.exports = auth;
