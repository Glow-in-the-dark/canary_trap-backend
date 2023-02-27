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
});

const GeneratedSchema = new mongoose.Schema({
  titleName: { type: String },
  newImg: {
    data: Buffer,
    contentType: String,
  },
  imgDelta: {
    data: Buffer,
    contentType: String,
  },
});

const imageSchema = new mongoose.Schema(
  {
    //account_ID: { type: String, required: true },
    title: { type: String, required: true },
    orig_img: [OriginalImageSchema],
    generated_imgs: [GeneratedSchema],
  },
  {
    collection: "Original_n_GeneratedIMGs",
  }
);

module.exports = mongoose.model("Original_n_GeneratedIMGs", imageSchema);
