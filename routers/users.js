const express = require("express");
const router = express.Router();

const controllers = require("../controllers/users");

// // This are the routes
router.put("/createUser", controllers.createNewUser);
router.post("/login", controllers.login);
router.post("/refresh", controllers.getRefreshToken);

module.exports = router;
