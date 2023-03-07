const express = require("express");
const router = express.Router();

const controllers = require("../controllers/users");
const auth = require("../middleware/auth");

// // This are the routes
router.put("/createUser", controllers.createNewUser);
router.post("/login", controllers.login);
router.post("/refresh", controllers.getRefreshToken);
router.put("/update", auth, controllers.updateUserDetails);
router.get("/projects", auth, controllers.getUserProjs);
router.delete("/projects/:projectId", auth, controllers.deleteUserProj);

// // This are the routes for Admin Only
router.get("/adminGetAllProjects", controllers.adminGetAllProjects);
router.get("/adminGetAllUsers", controllers.adminGetAllUsers);
router.delete("/adminDeleteProj", controllers.adminDeleteProj);
router.delete("/adminDeleteUser", controllers.adminDeleteUser);

module.exports = router;
