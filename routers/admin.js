const express = require("express");
const router = express.Router();

const controllers = require("../controllers/admin");

// // This are the routes
router.get("/getAllProjects", controllers.getAllProjects);
router.delete("/deleteProj", controllers.deleteProj);

module.exports = router;
