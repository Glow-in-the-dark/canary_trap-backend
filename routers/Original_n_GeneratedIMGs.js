const express = require("express");
const router = express.Router();
const controllers = require("../controllers/Original_n_GeneratedIMGs");
// const auth = require("../middleware/auth");

/////////////////////////////////////////////////////////////////////////
// Handling Image Events
const multer = require("multer");

const storage = multer.diskStorage({
  // declare the destination for the file in server side
  destination: (req, file, callback) => {
    callback(null, "uploads_folder");
  },
  // file name saved as the original file name when uploaded
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

//storing the data we stored above under a variable "storage", and assign a key called storage
const upload = multer({ storage: storage });
////////////////////////////////////////////////////////////////////////

// testing endpoint, to make sure the image is stored in database
router.post("/test", upload.single("originalImg"), controllers.test);

// CREATE:
// router.put("/uploadImg", controllers.uploadImageAndGenerate);

module.exports = router;
