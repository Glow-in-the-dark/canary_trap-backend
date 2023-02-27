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
  img_red = [];
  img_green = [];
  img_blue = [];
  img_alpha = [];

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
  const percentageAltered = 0.4;
  const alteredPixels = Math.floor(totalPixel * percentageAltered);

  for (let i = 0; i <= alteredPixels; i++) {
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

  image_altered.write("MODDED.png");

  // Instantiate altered Img array
  alt_img_red = [];
  alt_img_green = [];
  alt_img_blue = [];
  alt_img_alpha = [];

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
  //--------------
  //   // set a 20% chance it will apply a filter
  //   let r = Math.random();
  //   if (r < 0.2) {
  //     // 100% of the time of the 20% it will apply a small +/- red filter
  //     if (red > 0 && red < 255) {
  //       let rd = Math.random();
  //       if (rd < 0.5) {
  //         this.bitmap.data[idx + 0] = red - 1;
  //         alt_img_red.push(this.bitmap.data[idx + 0]);
  //       } else {
  //         this.bitmap.data[idx + 0] = red + 1;
  //         alt_img_red.push(this.bitmap.data[idx + 0]);
  //       }
  //     }
  //     // if is < 0.15, which is 75% of the 20%, it will apply both red and green filter.
  //     if (r < 0.15) {
  //       if (green > 0 && green < 255) {
  //         let rd = Math.random();
  //         if (rd < 0.5) {
  //           this.bitmap.data[idx + 1] = green - 1;
  //           alt_img_green.push(this.bitmap.data[idx + 1]);
  //         } else {
  //           this.bitmap.data[idx + 1] = green + 1;
  //           alt_img_green.push(this.bitmap.data[idx + 1]);
  //         }
  //       }
  //     }
  //     // less than 0.10, apply red, green & blue filter
  //     if (r < 0.1) {
  //       if (blue > 0 && blue < 255) {
  //         let rd = Math.random();
  //         if (rd < 0.5) {
  //           this.bitmap.data[idx + 2] = blue - 1;
  //           alt_img_blue.push(this.bitmap.data[idx + 2]);
  //         } else {
  //           this.bitmap.data[idx + 2] = blue + 1;
  //           alt_img_blue.push(this.bitmap.data[idx + 2]);
  //         }
  //       }
  //     }
  //     if (r < 0.05) {
  //       if (alpha > 0 && alpha < 255) {
  //         let rd = Math.random();
  //         if (rd < 0.5) {
  //           this.bitmap.data[idx + 3] = alpha - 1;
  //           alt_img_alpha.push(this.bitmap.data[idx + 3]);
  //         } else {
  //           this.bitmap.data[idx + 3] = alpha + 1;
  //           alt_img_alpha.push(this.bitmap.data[idx + 3]);
  //         }
  //       }
  //     }
  //   } else {
  //     alt_img_red.push(red);
  //     alt_img_green.push(green);
  //     alt_img_blue.push(blue);
  //     alt_img_alpha.push(alpha);
  //   }
  // });

  //   // original img data:
  //   console.log(img_red);
  //   console.log(img_green);
  //   console.log(img_blue);
  //   console.log(img_alpha);
  //   console.log(img_red.length);

  //   // alt img data:
  //   console.log(alt_img_red);
  //   console.log(alt_img_green);
  //   console.log(alt_img_blue);
  //   console.log(alt_img_alpha);
  //   console.log(alt_img_red.length);

  console.log(image_OG.pHash());
  console.log(image_altered.pHash());
});
