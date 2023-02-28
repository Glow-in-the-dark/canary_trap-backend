const Jimp = require("jimp");

// This part is where we use JIMP to manipulate the images. It reads the image from the path, and then outputs to image, where we can then access and use it.
Jimp.read("Azuki.png", (err, image) => {
  if (err) throw err;

  const image_OG = image;
  const image_altered = image;

  // getting Width/Height of Original image
  const IMG_width = image_OG.bitmap.width;
  const IMG_height = image_OG.bitmap.height;

  // Instantiate Original Img array
  let img_red = [];
  let img_green = [];
  let img_blue = [];
  let img_alpha = [];

  //   image.quality(60).greyscale().write("greyscaled.jpg");

  // Manual image manipulation:
  const start_X_coor = 0;
  const start_Y_coor = 0;

  // manage to get the size.
  console.log(IMG_width); //width
  console.log(IMG_height); //height

  // Over here, we DECOMPOSE the Image into each pixel, and each pixel into each RGBA.
  // image.scan loops through starting(x,y)coor to end(x,y)coor, to either get the colors or change the colours.
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

  // --------- ALTERED IMAGE PARTS -----------

  const totalPixel = IMG_width * IMG_height;
  const percentageAltered = 0.8;
  // const percentageAltered = 2;
  const alteredPixels = Math.floor(totalPixel * percentageAltered);

  // This FOR loop, loops throught the randomly selected pixels to alter it
  for (let i = 0; i <= alteredPixels; i++) {
    // // test if it really alters:
    // // try on first pixel.
    // const newColor = Jimp.rgbaToInt(255, 255, 255, 0);
    // image_altered.setPixelColor(newColor, 0, 0);
    // // test end...

    const rand_width = Math.floor(Math.random() * IMG_width + 1);
    const rand_height = Math.floor(Math.random() * IMG_height + 1);

    // get individual pixel color from random pixel
    const hex_color = image_altered.getPixelColor(rand_width, rand_height);
    const pixel_RGBA = Jimp.intToRGBA(hex_color); // RGBA in this obj format => { r: 49, g: 62, b: 80, a: 255 }
    // console.log(pixel_RGBA);

    const rand_color = Math.floor(Math.random() * 4 + 1);
    if (rand_color == 1) {
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
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        }
      }
    } else if (rand_color == 2) {
      const green = pixel_RGBA.g;
      if (green > 0 && green < 255) {
        let rd = Math.random();
        if (rd < 0.5) {
          pixel_RGBA.g = green - 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter green");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        } else {
          pixel_RGBA.g = green + 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter green");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        }
      }
    } else if (rand_color == 3) {
      const blue = pixel_RGBA.b;
      if (blue > 0 && blue < 255) {
        let rd = Math.random();
        if (rd < 0.5) {
          pixel_RGBA.b = blue - 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter blue");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        } else {
          pixel_RGBA.b = blue + 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter blue");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        }
      }
    } else {
      const alpha = pixel_RGBA.a;
      if (alpha > 0 && alpha < 255) {
        let rd = Math.random();
        if (rd < 0.5) {
          pixel_RGBA.a = alpha - 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter alpha");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        } else {
          pixel_RGBA.a = alpha + 1;
          //   console.log(pixel_RGBA);
          //   console.log("alter alpha");
          const new_Hex_color = Jimp.rgbaToInt(
            pixel_RGBA.r,
            pixel_RGBA.g,
            pixel_RGBA.b,
            pixel_RGBA.a
          );
          image_altered.setPixelColor(new_Hex_color, rand_width, rand_height);
        }
      }
    }
  }

  // OUTPUT the alted image file.
  image_altered.write("MODDED.png");

  // Instantiate altered Img array
  let alt_img_red = [];
  let alt_img_green = [];
  let alt_img_blue = [];
  let alt_img_alpha = [];

  image_altered.scan(
    start_X_coor,
    start_Y_coor,
    IMG_width,
    IMG_height,
    function (x, y, idx) {
      let red = this.bitmap.data[idx + 0];
      let green = this.bitmap.data[idx + 1];
      let blue = this.bitmap.data[idx + 2];
      let alpha = this.bitmap.data[idx + 3];

      alt_img_red.push(red);
      alt_img_green.push(green);
      alt_img_blue.push(blue);
      alt_img_alpha.push(alpha);
    }
  );
  // // -----------------------THIS PART BELOW IS ONLY FOR CHECKING --------------------------------------
  // // original img data:
  // console.log("original data----------------");
  // console.log(img_red);
  // console.log(img_green);
  // console.log(img_blue);
  // console.log(img_alpha);
  // console.log(img_red.length);

  // //   // alt img data:
  // console.log("altered data-------------------");
  // console.log(alt_img_red);
  // console.log(alt_img_green);
  // console.log(alt_img_blue);
  // console.log(alt_img_alpha);
  // console.log(alt_img_red.length);

  // console.log(image_OG.pHash());
  // console.log(image_altered.pHash());

  function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }

  // CHECK to make sure altered layer is different from Originals.
  console.log("checks every layer of altered vs Original");
  console.log("checks on red layer");
  console.log(arrayEquals(alt_img_red, img_red));
  console.log("checks on green layer");
  console.log(arrayEquals(alt_img_green, img_green));
  console.log("checks on blue layer");
  console.log(arrayEquals(alt_img_blue, img_blue));
  console.log("checks on alpha layer");
  console.log(arrayEquals(alt_img_alpha, img_alpha));

  // CHECK TO MAKE SURE MODDED IMGs equates.
  console.log(
    "checks if the altered images array, matched with the MODDED image output."
  );

  // CHECKING THE UPLOADED ALTERED IMAGE...
  Jimp.read("MODDED.png", (err, alt_image) => {
    // if (err) throw err;

    // Instantiate altered Img array
    let mod_img_red = [];
    let mod_img_green = [];
    let mod_img_blue = [];
    let mod_img_alpha = [];

    alt_image.scan(
      start_X_coor,
      start_Y_coor,
      IMG_width,
      IMG_height,
      function (x, y, idx) {
        let red = this.bitmap.data[idx + 0];
        let green = this.bitmap.data[idx + 1];
        let blue = this.bitmap.data[idx + 2];
        let alpha = this.bitmap.data[idx + 3];

        mod_img_red.push(red);
        mod_img_green.push(green);
        mod_img_blue.push(blue);
        mod_img_alpha.push(alpha);
      }
    );

    // console.log("checks on red layer");
    // console.log(arrayEquals(alt_img_red, mod_img_red));
    // console.log("checks on green layer");
    // console.log(arrayEquals(alt_img_green, mod_img_green));
    // console.log("checks on blue layer");
    // console.log(arrayEquals(alt_img_blue, mod_img_blue));
    // console.log("checks on alpha layer");
    // console.log(arrayEquals(alt_img_alpha, mod_img_alpha));

    // console.log("checks every layer of MODDED vs Original");
    // console.log("checks on red layer");
    // console.log(arrayEquals(mod_img_red, img_red));
    // console.log("checks on green layer");
    // console.log(arrayEquals(mod_img_green, img_green));
    // console.log("checks on blue layer");
    // console.log(arrayEquals(mod_img_blue, img_blue));
    // console.log("checks on alpha layer");
    // console.log(arrayEquals(mod_img_alpha, img_alpha));
  });
});
