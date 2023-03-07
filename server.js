require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const routeToImgUpload = require("./routers/Original_n_GeneratedIMGs");
const routeToUsers = require("./routers/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.MONGODB_URI);

// ROUTING -----

app.use("/uploadImg", routeToImgUpload); // Route to all volunteer endpoints
app.use("/users", routeToUsers); // Route to all user & admin endpoints

app.listen(process.env.PORT, () => {
  console.log(`server started on Port ${process.env.PORT}`);
});
