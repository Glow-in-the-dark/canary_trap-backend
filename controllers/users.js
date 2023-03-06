// DEPENDENCIES
require("dotenv").config();
const User = require("../models/User.js");

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
    // If want to update new password/hash
    // const newHash = await bcrypt.hash(req.body.password, 12);

    // On the frontend side, put the "email" from the JWT token" into the API's req
    const updateUsernameByEmail = await User.findOneAndUpdate(
      { email: req.body.JWTemail },
      {
        username: req.body.username,
        // email: req.body.newEmail, // if want to update email
        // hash: newHash,  // if want to update password
      },
      { new: true }
    );

    console.log("updated username to: ", req.body.username);
    res.json({ status: "okay", message: "username updated" });
  } catch (error) {
    console.log("PUT /users/updateUserDetails", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

// EXPORT
module.exports = {
  createNewUser,
  login,
  getRefreshToken,
  updateUserDetails,
};
