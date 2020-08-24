const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../../models/superadmin");
const Mood = require("../../models/mood");
const passport = require("passport");
const utils = require("../../../config/utils");
const constant = require("../../../config/constant");
const superadminController = require("../../controllers/superadmin/superadminController");

router.route("/register").post(superadminController.Register);
router.route("/login").post(superadminController.Login);
router.route("/listallmood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListMoods
);
router.route("/listmoodbyid").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListMoodsById
);

router.route("/addmood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.AddMood
);
router.route("/addmoodwithurl").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.AddMoodWithUrl
);
router.route("/updatemood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UpdateMood
);
router.route("/updatemoodwithimage").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UpdateMoodWithImage
);
router.route("/activatemood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ActivateMood
);
router.route("/deletemood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.DeleteMood
);
// router.route("/uploadmoodimage").post(
//   // passport.authenticate("jwt", { session: false }),
//   superadminController.UploadMoodImage
// );
router.route("/uploadmoodsong").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UploadMoodSong
);
router.route("/deletesong").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.DeleteSong
);
router.route("/updatesongstatus").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UpdateSongPreviewStatus
);

router.route("/listsongbymood").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListSongByMood
);
router.route("/addplan").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.AddNewSubscriptionPlan
);
router.route("/listallplan").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListSubscriptionPlan
);
router.route("/listplanbyid").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListSubscriptionPlanById
);
router.route("/updateplan").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UpdateSubscriptionPlan
);
// To activate/deactivate plan
router.route("/updateplanstatus").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.UpdateSubscriptionPlanStatus
);
router.route("/listalltransaction").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListAllTransaction
);
router.route("/listtransactionbyid").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListTransactionById
);
router.route("/listalluser").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.ListAllUser
);
router.route("/homescreenapi").post(
  // passport.authenticate("jwt", { session: false }),
  superadminController.HomeScreen
);
module.exports = router;
