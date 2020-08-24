const express = require("express");
const db = require("./src/helpers/database");
const path = require("path");
const passport = require("passport");
const expressValidator = require("express-validator");
const cors = require("cors");
const helmet = require("helmet");

var app = express();
require("dotenv").config();
require("./src/helpers/passport")(passport);
require("./config/googleDrive");

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our  application to make HTTP requests to Express application
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("./src/routes/v1"));
//app.use();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
