var express = require("express");
var router = express.Router();
//const verify = require("../javascripts/verifyToken");
var superadminRouter = require("./superadminroute");
var userRouter = require("./userroute");

/* GET home page. */
// router.get("/", function(req, res, next) {
//   console.log("index page");
//   res.send("initialized");
// });
router.get("/verify", function(req, res, next) {
  console.log("verification page" + req.query.id);
  res.send("initialized");
});
router.use("/user", userRouter);
router.use("/superadmin", superadminRouter);

module.exports = router;
