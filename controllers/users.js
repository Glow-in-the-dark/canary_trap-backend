// DEPENDENCIES
require("dotenv").config();
const User = require("../models/User.js");
const Original_n_GeneratedIMGs = require("../models/Original_n_GeneratedIMGs.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // add JWT
const { v4: uuidv4 } = require("uuid"); // add uuid.

// FUNCTIONS
const createNewUser = async (req, res) => {
  try {
    //check if email is already in use
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "duplicate email" });
    }

    console.log("1 : ", user);
    console.log(req);
    console.log("body");
    console.log(req.body);

    // if no duplicate, create account
    const hash = await bcrypt.hash(req.body.password, 12); // 12 is how many times it runs, salt is included inside.
    console.log("2 : ", hash);
    const createdUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      hash,
    });

    console.log("3 : ", createdUser);

    console.log("created user is: ", createdUser);
    res.json({ status: "okay", message: "user created" });
  } catch (error) {
    console.log("PUT /user/createUser", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

const login = async (req, res) => {
  try {
    // Check if username and password exists in database
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "not authorised" });
    }

    // Check if password is correct
    // Using bcrypt
    const result = await bcrypt.compare(req.body.password, user.hash);

    if (!result) {
      return res.status(401).json({ status: "error", message: "login failed" });
    }

    // Create JWT
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    // Creating ACCCESS token via JWT
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      //   expiresIn: "20mins",  // usually "20mins"
      expiresIn: "60mins",
      jwtid: uuidv4(),
    });

    // Creating REFRESH token via JWT
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });

    user = user.toJSON();

    let responseUser = { ...user };
    delete responseUser.hash; // IMPORTANT to remove the HASH from the response!!!
    const response = {
      access,
      refresh,
      isAdmin: user.isAdmin,
      userObj: responseUser,
    };
    res.json(response);
  } catch (error) {
    console.log("POST /users/login", error);
    res.status(400).json({ status: "error", message: "login failed" });
  }
};

//generate REFRESH token
const getRefreshToken = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const payload = {
      id: decoded.id,
      name: decoded.name,
    };

    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      // expiresIn: "20mins",
      expiresIn: "4h",
      jwtid: uuidv4(),
    });

    const response = { access };

    res.json(response);
  } catch (error) {
    console.log("POST /users/refresh", error);
    res.status(401).json({ status: "error", message: "unauthorised" });
  }
};

//updating User details (change Username)
const updateUserDetails = async (req, res) => {
  try {
    console.log("req.user");
    console.log(req.user);
    // If want to update new password/hash
    // const newHash = await bcrypt.hash(req.body.password, 12);

    // On the frontend side, put the "email" from the JWT token" into the API's req
    const updateUsernameByEmail = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        username: req.body.username,
        // email: req.body.newEmail, // if want to update email
        // hash: newHash,  // if want to update password
      },
      { new: true }
    );

    console.log("updated username to: ", req.body.username);
    res.json({
      newUsername: req.body.username,
      status: "okay",
      message: "username updated",
    });
  } catch (error) {
    console.log("PUT /users/updateUserDetails", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

const getUserProjs = async (req, res) => {
  try {
    // On the frontend side, put the "email" from the JWT token" into the API's req
    const allUserProjs = await Original_n_GeneratedIMGs.find({
      createdBy: req.user._id,
    });

    console.log("allUserProjs : ", allUserProjs);

    const strippedAllUserProjsArr = allUserProjs.map((eachProj) => {
      tempObj = {
        createdBy: eachProj.createdBy,
        title: eachProj.title,
        imgFiletype: eachProj.imgFiletype,
        description: eachProj.description,
        orig_img: eachProj.orig_img,
        _id: eachProj._id,
      };

      // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      // title: { type: String, required: true },
      // imgFiletype: { type: String },
      // description: { type: String },
      // orig_img: [OriginalImageSchema],
      return tempObj;
    });

    return res.status(200).json({
      projects: strippedAllUserProjsArr,
    });
  } catch (error) {
    console.log("PUT /users/updateUserDetails", error);
    return res
      .status(400)
      .json({ status: "error", message: "an error has occurred" });
  }
};

const deleteUserProj = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("projectId : ", projectId);
    const deletedProj = await Original_n_GeneratedIMGs.deleteOne({
      _id: projectId,
    });
    console.log("deletedProj : ", deletedProj);
    // On the frontend side, put the "email" from the JWT token" into the API's req
    const allUserProjs = await Original_n_GeneratedIMGs.find({
      createdBy: req.user._id,
    });

    const strippedAllUserProjsArr = allUserProjs.map((eachProj) => {
      tempObj = {
        createdBy: eachProj.createdBy,
        title: eachProj.title,
        imgFiletype: eachProj.imgFiletype,
        description: eachProj.description,
        orig_img: eachProj.orig_img,
        _id: eachProj._id,
      };

      // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      // title: { type: String, required: true },
      // imgFiletype: { type: String },
      // description: { type: String },
      // orig_img: [OriginalImageSchema],
      return tempObj;
    });

    console.log("strippedAllUserProjsArr2 : ", strippedAllUserProjsArr);

    return res.status(200).json({
      projects: strippedAllUserProjsArr,
    });
  } catch (error) {
    console.log("PUT /users/updateUserDetails", error);
    return res
      .status(400)
      .json({ status: "error", message: "an error has occurred" });
  }
};

///// ---------  FUNCTION FOR ADMIN ONLY (ENDPOINTS) -------------------
const adminGetAllProjects = async (req, res) => {
  // This part check to make sure
  if (!req.user || (req.user && !req.user.isAdmin)) {
    return res.status(403).json({ message: "You are not Admin !" });
  }
  // codes
  const allProjects = await Original_n_GeneratedIMGs.find();
  //strip the img buffer for response.
  let strippedAllProj = [];
  for (let i = 0; i < allProjects.length; i++) {
    const tempObj = {
      _id: "",
      title: "",
      imgFiletype: "",
      description: "",
    };
    tempObj._id = allProjects[i]._id;
    tempObj.title = allProjects[i].title;
    tempObj.imgFiletype = allProjects[i].imgFiletype;
    tempObj.description = allProjects[i].description;

    strippedAllProj.push(tempObj);
  }

  return res.json(strippedAllProj);
};

const adminGetAllUsers = async (req, res) => {
  if (!req.user || (req.user && !req.user.isAdmin)) {
    return res.status(403).json({ message: "You are not Admin !" });
  }
  // codes
  const allUsers = await User.find();
  return res.json(allUsers);
};

//delete based on _id
const adminDeleteProj = async (req, res) => {
  if (!req.user || (req.user && !req.user.isAdmin)) {
    return res.status(403).json({ message: "You are not Admin !" });
  }
  // codes
  const deleteProjects = await Original_n_GeneratedIMGs.findOneAndDelete(
    { _id: req.body._id },
    {}
  );
  res.send({ status: "ok", message: "deleted Proj as Admin" });
};

//delete based on user _id
const adminDeleteUser = async (req, res) => {
  if (!req.user || (req.user && !req.user.isAdmin)) {
    return res.status(403).json({ message: "You are not Admin !" });
  }
  // codes
  const deleteUser = await User.findOneAndDelete({ _id: req.body._id }, {});
  return res.send({ status: "ok", message: "deleted User as Admin" });
};

// EXPORT
module.exports = {
  createNewUser,
  login,
  getRefreshToken,
  updateUserDetails,
  getUserProjs,
  deleteUserProj,
  //admins only
  adminGetAllProjects,
  adminGetAllUsers,
  adminDeleteProj,
  adminDeleteUser,
};
