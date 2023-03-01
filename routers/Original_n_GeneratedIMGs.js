const express = require("express");
const router = express.Router();
const controllers = require("../controllers/Original_n_GeneratedIMGs");
// const auth = require("../middleware/auth");

/////////////////////////////////////////////////////////////////////////
// Handling Image Events
const multer = require("multer");
//------------- For Original Images ---------------

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

//------------- For Suspected Leaked Images ---------------
const leakStorage = multer.diskStorage({
  // declare the destination for the file in server side
  destination: (req, file, callback) => {
    callback(null, "checkLeak_folder");
  },
  // file name saved as the original file name when uploaded
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
//storing the data we stored above under a variable "storage", and assign a key called storage
const upload2 = multer({ storage: leakStorage });

////////////////////////////////////////////////////////////////////////

// ROUTES ARE HERE vvvvvvvvvvv

// CREATE endpoint, STORE uploaded image is stored in Upload folder + database + generate altered images.
router.post("/create", upload.single("originalImg"), controllers.create);
// UPLOAD suspected leaked images.
router.post("/expose", upload2.single("susLeakedImg"), controllers.expose);

// CREATE:
// router.put("/uploadImg", controllers.uploadImageAndGenerate);

module.exports = router;
