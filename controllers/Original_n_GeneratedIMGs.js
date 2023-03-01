require("dotenv").config();
const fs = require("fs"); // import filesystem module
const Jimp = require("jimp");

const Original_n_GeneratedIMGs = require("../models/Original_n_GeneratedIMGs");

async function test(req, res) {
  console.log("RUN TEST");
  console.log(req.file);

  try {
    // storing Incoming uploaded request DATA into variables for easy access later on.
    const distribution_Qty = req.body.qty;
    const nameStr = req.body.names;
    const nameArray = nameStr.split(","); // Change it into an ARRAY of Names.
    const uploadedFilename = req.file.originalname;
    const uploadedFilePath = req.file.path;

    const image = await Jimp.read(req.file.path);
    // duplicate the image read into 2 variables for different manipulations.
    const image_OG = image;
    const image_altered = image;

    // getting Width/Height of Original image
    const IMG_width = image_OG.bitmap.width;
    const IMG_height = image_OG.bitmap.height;
    // check if we can get the SIZE.
    console.log(IMG_width); //width
    console.log(IMG_height); //height

    const start_X_coor = 0;
    const start_Y_coor = 0;

    // Instantiate Original Img array
    let img_red = [];
    let img_green = [];
    let img_blue = [];
    let img_alpha = [];

    image_OG.scan(
      start_X_coor,
      start_Y_coor,
      IMG_width,
      IMG_height,
      function (x, y, idx) {
        // Get the colors
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const alpha = this.bitmap.data[idx + 3];

        img_red.push(red);
        img_green.push(green);
        img_blue.push(blue);
        img_alpha.push(alpha);
      }
    );

    //works now
    console.log(img_red);
    console.log(img_green);
    console.log(img_blue);
    console.log(img_alpha);

    // Uploading to database, with the huge array dataset, But sizew too big, it jammes up mongo.
    // From the "body" of request data, Store incoming Original Data in an {obj} first as a variable, before setting this {obj} and saving it in database
    const incomingUpload = {
      title: req.body.title,
      qty: distribution_Qty,
      namesArray: nameArray,
      description: req.body.description,
      originalImg: {
        data: fs.readFileSync("uploads_folder/" + req.file.filename),
        contentType: "image/jpg",
      },
      // redArray: img_red,
      // greenArray: img_green,
      // blueArray: img_blue,
      // alphaArray: img_alpha,
    };

    // REMEMBER TO CHECK FOR same filename/ ELSE it will overwrite !! ( Need to code)
    // create new item in database
    const newUpload = new Original_n_GeneratedIMGs({
      title: req.body.title,
    });

    //push new incoming Upload into the "orig_img" array
    newUpload.orig_img.push(incomingUpload);

    // save
    const savedUpload = await newUpload.save();
    console.log("Original Upload Image saved");
    res.json({
      message: "Event created successfully",
      createdEvent: savedUpload,
    });
  } catch (error) {
    console.log("POST /uploadImg/test", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}

async function uploadImageAndGenerate(req, res) {
  try {
    // Check if username is already in use
    const user = await Users.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "duplicate email" });
    }

    // If no duplicate, create new account
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = new Users({
      name: req.body.name,
      mobile_number: req.body.mobile_number,
      email: req.body.email,
      hash: hash,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      organisation: req.body.organisation,
      occupation: req.body.occupation,
    });

    await newUser.save();
    console.log("created user is: ", newUser);
    return res.json({ status: "okay", message: "user created" });
  } catch (error) {
    console.log("PUT /users/create", error);
    return res
      .status(400)
      .json({ status: "error", message: "an error has occured" });
  }
}

module.exports = {
  test,
  //   uploadImageAndGenerate,
};
