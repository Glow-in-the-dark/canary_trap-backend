require("dotenv").config();
const fs = require("fs"); // import filesystem module.
const Jimp = require("jimp"); // Image manipulation.
const nodemailer = require("nodemailer"); // to send emails with image attachments.

const User = require("../models/User.js");
const Original_n_GeneratedIMGs = require("../models/Original_n_GeneratedIMGs");

async function create(req, res) {
  console.log("RUN Create_Expose");
  console.log(req.file);

  try {
    // storing Incoming uploaded request DATA into variables for easy access later on.

    // Add USERID, and check for authentication
    const targetUserId = req.user && req.user._id;
    if (!targetUserId) {
      res.status(403).json({ status: "error", message: "Unauthorized Error" });
    }
    const distribution_Qty = req.body.qty;
    const nameStr = req.body.names;
    const nameArray = nameStr.split(","); // Change it into an ARRAY of Names.
    const uploadedFilename = req.file.originalname;
    const uploadedFilePath = req.file.path;
    // get Img_filetype
    const imgFiletype = req.file.mimetype;

    const image = await Jimp.read(req.file.path);
    // duplicate the image read into 2 variables for different manipulations.
    const image_OG = image;
    const image_altered = image;

    // --------     ORIGINAL IMAGE (JIMP)  ------------------------------
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

    image_OG.scan(
      start_X_coor,
      start_Y_coor,
      IMG_width,
      IMG_height,
      function (x, y, idx) {
        // Get the colors
        const red = this.bitmap.data[idx + 0];

        img_red.push(red);
      }
    );
    // //works now
    console.log("logging original red array", img_red);

    // --------     ORIGINAL IMAGE (JIMP) (end)  ------------------------------

    //  ------ ORIGINAL IMAGE - UPLOAD to DATABASE (start) ----------------------
    // Uploading to database, with the huge array dataset, But sizew too big, it jammes up mongo.
    // From the "body" of request data, Store incoming Original Data in an {obj} first as a variable, before setting this {obj} and saving it in database
    const incomingUpload = {
      title: req.body.title,
      qty: distribution_Qty,
      namesArray: nameArray,
      // description: req.body.description,
      originalImg: {
        data: fs.readFileSync("uploads_folder/" + req.file.filename),
        contentType: imgFiletype,
      },
      redArray: img_red,
    };

    // REMEMBER TO CHECK FOR same filename/ ELSE it will overwrite !! ( Need to code)
    // create new item in database
    const newUpload = new Original_n_GeneratedIMGs({
      createdBy: targetUserId,
      title: req.body.title,
      imgFiletype: imgFiletype,
      description: req.body.description,
    });
    //push new incoming Upload into the "orig_img" array in the DATABASE
    newUpload.orig_img.push(incomingUpload);

    //  ------ ORIGINAL IMAGE - UPLOAD to DATABASE (end) ----------------------

    // --------   Generate Multiple + Altered IMAGE + push to Database   ------------------------------
    const totalPixel = IMG_width * IMG_height;
    const percentageAltered = 0.8;
    // const percentageAltered = 2;
    const alteredPixels = Math.floor(totalPixel * percentageAltered);

    for (let i = 0; i < nameArray.length; i++) {
      //LOOPing each image manipulation + pushing
      // This FOR loop, loops throught the randomly selected pixels to alter it
      for (let i = 0; i <= alteredPixels; i++) {
        // // test if it really alters:
        // // try on first pixel.
        // const newColor = Jimp.rgbaToInt(88, 255, 255, 0);
        // image_altered.setPixelColor(newColor, 0, 0);
        // // test end...

        const rand_width = Math.floor(Math.random() * IMG_width + 1);
        const rand_height = Math.floor(Math.random() * IMG_height + 1);

        // get individual pixel color from random pixel
        const hex_color = image_altered.getPixelColor(rand_width, rand_height);
        const pixel_RGBA = Jimp.intToRGBA(hex_color); // RGBA in this obj format => { r: 49, g: 62, b: 80, a: 255 }
        // console.log(" still OG random pixel's RGBA", pixel_RGBA);

        // get the red "value" from selected random pixel.
        const red = pixel_RGBA.r;
        if (red > 0 && red < 255) {
          let rd = Math.random();
          if (rd < 0.5) {
            pixel_RGBA.r = red - 1;
            //   console.log(pixel_RGBA);
            //   console.log("alter red");
            const new_Hex_color = Jimp.rgbaToInt(
              pixel_RGBA.r,
              pixel_RGBA.g,
              pixel_RGBA.b,
              pixel_RGBA.a
            );
            // // logging new pixel RGBA Change
            // const testNewPixelRGBA = {
            //   r: pixel_RGBA.r,
            //   g: pixel_RGBA.g,
            //   b: pixel_RGBA.b,
            //   a: pixel_RGBA.a,
            // };
            // console.log("new random pixel's RGBA r-1", pixel_RGBA);
            image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
          } else {
            pixel_RGBA.r = red + 1;
            //   console.log(pixel_RGBA);
            //   console.log("alter red");
            const new_Hex_color = Jimp.rgbaToInt(
              pixel_RGBA.r,
              pixel_RGBA.g,
              pixel_RGBA.b,
              pixel_RGBA.a
            );
            // // logging new pixel RGBA Change
            // const testNewPixelRGBA = {
            //   r: pixel_RGBA.r,
            //   g: pixel_RGBA.g,
            //   b: pixel_RGBA.b,
            //   a: pixel_RGBA.a,
            // };
            // console.log("new random pixel's RGBA r+1", pixel_RGBA);
            image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
          }
        }
      }

      // OUTPUT the altered image file. ---------------
      const stripped = uploadedFilename.split(".");
      const strippedFileName = stripped[0];
      const strippedFileType = stripped[1];
      const newAlteredImage_filename =
        strippedFileName + "_" + nameArray[i] + "." + strippedFileType;
      console.log(newAlteredImage_filename);

      // outputs the image for every loop of the current altered Image.
      image_altered.write("uploads_folder/" + newAlteredImage_filename);

      // // Taking the current Altered File and make it into a Array (red pixel)--------------
      //
      // Instantiate altered Img array
      let alt_img_red = [];

      // populating the "alt_img_red = []" Array
      image_altered.scan(
        start_X_coor,
        start_Y_coor,
        IMG_width,
        IMG_height,
        function (x, y, idx) {
          let red = this.bitmap.data[idx + 0];

          alt_img_red.push(red);
        }
      );

      // change it into 'buffer' format
      const altered_img_buffer = await image_altered.getBufferAsync(
        imgFiletype
      );
      console.log("---- redArray of altered img(" + nameArray[i] + ") -----");
      console.log(altered_img_buffer);
      console.log(alt_img_red);

      const eachAlteredImg = {
        titleName: req.body.title,
        receipientName: nameArray[i],
        alteredImgBuffer: {
          data: altered_img_buffer,
          contentType: imgFiletype,
        },
        newRedArray: alt_img_red,
        // newGreenArray: alt_img_green,
        // newBlueArray: alt_img_blue,
        // newAlphaArray: alt_img_alpha,
      };

      //push new incoming Upload into the "generated_imgs" array
      newUpload.generated_imgs.push(eachAlteredImg);

      // Find user (Proj creator's) EMAIL from User's Database(model):   ------ EMAILING PORTION ------
      console.log(targetUserId);
      const projCreatorEmail = await User.find({
        _id: targetUserId,
      });
      const creatorEmail = projCreatorEmail[0].email;
      console.log("will be sending email to:", creatorEmail);

      const CLIENT_ID = process.env.CLIENT_ID;
      const CLIENT_SECRET = process.env.CLIENT_SECRET;
      const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
      // console.log("This is Client_ID:", CLIENT_ID);
      // console.log("This is CLIENT_SECRET:", CLIENT_SECRET);
      // console.log("This is ACCESS_TOKEN:", ACCESS_TOKEN);

      async function sendEmail() {
        try {
          const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: "Canary.Trapper888@gmail.com",
              clientID: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              // accessToken, see here: "https://www.youtube.com/watch?v=vjv6vkAVNYU"
              // accessToken only last 1 hour, need to update and put in new one.
              accessToken: ACCESS_TOKEN,
            },
          });

          const mailOptions = {
            from: "Canary.Trapper888@gmail.com",
            to: creatorEmail,
            subject: "Images from Canary Trap: attachments",
            text: "This is the body of the message",
            html: `<h2> Thank you for Signing Up </h2> </br> Here are the attached images for ${nameArray[i]}`,
            attachments: [
              {
                filename: newAlteredImage_filename,
                path: "./uploads_folder/" + newAlteredImage_filename,
              },
            ],
          };

          const result = await transport.sendMail(mailOptions);
          return result;
        } catch (error) {
          console.log(error);
        }
      }

      sendEmail()
        .then((result) => {
          console.log("Email is sent" + result);
        })
        .catch((error) => {
          console.log("Error is" + error.message);
        });
    }
    // --------   Generate Multiple - Altered IMAGE  (end)   ------------------------------

    // save
    const savedUpload = await newUpload.save();
    console.log("Original Upload Image saved");
    return res.json({
      message: "Event created successfully",
      createdEvent: savedUpload,
    });
  } catch (error) {
    console.log("POST /uploadImg/create", error);
    return res.status(400).json({ status: "error", message: error.message });
  }
}

function checkDifference(arr1, arr2) {
  error_index = [];
  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] != arr2[index]) error_index.push(index);
  }
  console.log("error_index.length : ", error_index.length);
  console.log("error_index : ", error_index);
}

async function expose(req, res) {
  console.log(req.file);
  console.log(req.file.path);
  const imgFiletype = req.file.mimetype;

  // function to check Arrays's equality
  function arrayEquals(a, b) {
    console.log("in in array equal...");
    console.log("a.length === b.length: ", a.length === b.length);
    console.log(
      "a.every((val, index) => val === b[index]) : ",
      a.every((val, index) => val == b[index])
    );
    console.log("returning....");
    checkDifference(a, b);
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val == b[index])
    );
  }

  try {
    const susImage = await Jimp.read(req.file.path);
    const susImage_buffer = await susImage.getBufferAsync(imgFiletype);
    console.log(susImage_buffer);

    // Instantiate sus Img array
    let sus_img_red = [];
    let sus_img_green = [];
    let sus_img_blue = [];
    let sus_img_alpha = [];

    const start_X_coor = 0;
    const start_Y_coor = 0;
    const IMG_width = susImage.bitmap.width;
    const IMG_height = susImage.bitmap.height;

    susImage.scan(
      start_X_coor,
      start_Y_coor,
      IMG_width,
      IMG_height,
      function (x, y, idx) {
        let red = this.bitmap.data[idx + 0];
        let green = this.bitmap.data[idx + 1];
        let blue = this.bitmap.data[idx + 2];
        let alpha = this.bitmap.data[idx + 3];

        sus_img_red.push(red);
        sus_img_green.push(green);
        sus_img_blue.push(blue);
        sus_img_alpha.push(alpha);
      }
    );

    console.log("req.body.projectId : ", req.body.projectId);
    //find in database
    const data = await Original_n_GeneratedIMGs.findById(req.body.projectId);
    console.log("===check multiple titles===");
    console.log(data); // if got more than 2 data return, loop through the array too

    // find #no. of times to loop through
    const numGeneratedImgs = data.generated_imgs.length;

    for (let i = 0; i < numGeneratedImgs; i++) {
      console.log(sus_img_red.length);
      console.log(data.generated_imgs[i].newRedArray.length);
      if (arrayEquals(sus_img_red, data.generated_imgs[i].newRedArray)) {
        console.log("EQUALS !!: ", data.generated_imgs[i].receipientName);

        return res
          .status(200)
          .json({ name: data.generated_imgs[i].receipientName });
      } else {
        console.log(
          "Image not found... still finding. Currently at array location " +
            i.toString()
        );
        // return res.status(200).json({ message: "YOU_ARE_EXPOSED" });
      }
      // if (susImage_buffer == data[0].generated_imgs[i].alteredImgBuffer.data) {
      //   console.log(data[0].generated_imgs[i].receipientName);
      // } else {
      //   console.log(" Image not found");
      //   // console.log(susImage_buffer);
      //   console.log(data[0].generated_imgs[i].receipientName);
      // }
    }
    return res.status(200).json({ message: "YOU_ARE_EXPOSED" });
  } catch (error) {
    console.log("POST /uploadImg/expose", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}

module.exports = {
  create, //   uploadImage And Generate altered Imgs,
  expose,
};
