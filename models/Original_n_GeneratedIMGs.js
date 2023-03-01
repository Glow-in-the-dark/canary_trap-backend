const mongoose = require("mongoose");

const OriginalImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  qty: { type: Number, required: true },
  namesArray: [{ type: String, required: true }],
  description: { type: String },
  originalImg: {
    data: Buffer,
    contentType: String,
  },
  redArray: [{ type: Number }],
  greenArray: [{ type: Number }],
  blueArray: [{ type: Number }],
  alphaArray: [{ type: Number }],
});

const GeneratedSchema = new mongoose.Schema({
  titleName: { type: String },
  receipientName: { type: String },
  alteredImgBuffer: {
    data: Buffer,
    contentType: String,
  },
  newRedArray: [{ type: Number }],
  newGreenArray: [{ type: Number }],
  newBlueArray: [{ type: Number }],
  newAlphaArray: [{ type: Number }],
});

const imageSchema = new mongoose.Schema(
  {
    //account_ID: { type: String, required: true },
    title: { type: String, required: true },
    imgFiletype: { type: String },
    orig_img: [OriginalImageSchema],
    generated_imgs: [GeneratedSchema],
  },
  {
    collection: "Original_n_GeneratedIMGs",
  }
);

module.exports = mongoose.model("Original_n_GeneratedIMGs", imageSchema);
