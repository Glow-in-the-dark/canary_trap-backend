require("dotenv").config();
const fs = require("fs"); // import filesystem module
const Jimp = require("jimp");

const Original_n_GeneratedIMGs = require("../models/Original_n_GeneratedIMGs");

async function test(req, res) {
  console.log("RUN TEST");
  console.log(req.body.title);
  console.log(req.body.qty);
  console.log(req.body.names);
  console.log(req.file.originalname);
  console.log(typeof req.file);
  console.log(req.file);
  // console.log(req.img);
  // (async function () {
  //   const image = await Jimp.read(req.file);
  //   console.log("file Width and height");
  //   console.log(image.bitmap.width);
  //   console.log(image.bitmap.height);
  // });

  Jimp.read(req.file).then((image) => {
    return image.bitmap.width;
  });

  try {
    const quantity = req.body.qty;
    const nameStr = req.body.names;
    const nameArray = nameStr.split(",");
    console.log(nameArray);

    // Store incoming Original Data in an {obj} first as a variable, before setting this {obj} and saving it in database
    const incomingUpload = {
      title: req.body.title,
      qty: quantity,
      namesArray: nameArray,
      description: req.body.description,
      originalImg: {
        data: fs.readFileSync("uploads_folder/" + req.file.filename),
        contentType: "image/jpg",
      },
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
