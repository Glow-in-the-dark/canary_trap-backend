require("dotenv").config();

const User = require("../models/User.js");
const Original_n_GeneratedIMGs = require("../models/Original_n_GeneratedIMGs");

// Functions
// TODO:
// - Get all projects
// - DELETE

const getAllProjects = async (req, res) => {
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

  res.json(strippedAllProj);
};

//delete based on _id
const deleteProj = async (req, res) => {
  // codes
  const deleteProjects = await Original_n_GeneratedIMGs.findOneAndDelete(
    { _id: req.body._id },
    {}
  );
  // res.json(deletePlant); // shows what is deleted.
  res.send({ status: "ok", message: "deleted" });
};

// const createNewUser = async (req, res) => {
//     try {
//       //check if email is already in use
//       const user = await User.findOne({ email: req.body.email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ status: "error", message: "duplicate email" });
//       }

//       console.log("1 : ", user);
//       console.log(req);
//       console.log("body");
//       console.log(req.body);

//       // if no duplicate, create account
//       const hash = await bcrypt.hash(req.body.password, 12); // 12 is how many times it runs, salt is included inside.
//       console.log("2 : ", hash);
//       const createdUser = await User.create({
//         username: req.body.username,
//         email: req.body.email,
//         hash,
//       });

//       console.log("3 : ", createdUser);

//       console.log("created user is: ", createdUser);
//       res.json({ status: "okay", message: "user created" });
//     } catch (error) {
//       console.log("PUT /user/createUser", error);
//       res.status(400).json({ status: "error", message: "an error has occurred" });
//     }
//   };

module.exports = {
  getAllProjects,
  deleteProj,
};
