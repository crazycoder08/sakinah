const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const utils = require("../../../config/utils");
const userController = require("../../controllers/users/userController");
var validator = require("../../helpers/validator");
function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, function(err, user, info) {
    if (err) return next(err);
    if (!user)
      return res.status(401).send({
        error: {
          code: 401,
          message: "Invalid authorization code"
        }
      });

    req.user = user;
    next();
  })(req, res, next);
}
router
  .route("/register")
  .post(validator.validate("userSignup"), userController.Register);
router
  .route("/verifyaccount")
  .post(validator.validate("verifyAccount"), userController.VerifyAccount);
router
  .route("/login")
  .post(validator.validate("userLogin"), userController.Login);
router.route("/resetpassword").post(
  // passport.authenticate("jwt", { session: false }),
  userController.ResetUserPassword
);

router.route("/verifyotp").post(
  // passport.authenticate("jwt", { session: false }),
  userController.Verifyotp
);
router
  .route("/updatepassword")
  .post(authenticateJwt, userController.Updatepassword);
router
  .route("/updateprofile")
  .post(authenticateJwt, userController.Updateprofile);
router.route("/homescreenapi").post(authenticateJwt, userController.HomeScreen);
router
  .route("/purchasesubscription")
  .post(authenticateJwt, userController.PurchaseSubscription);
router
  .route("/paywithstripe")
  .post(authenticateJwt, userController.PayWithStripe);
router
  .route("/uploadprofilepicture")
  .post(authenticateJwt, userController.Uploadprofileimage);
router
  .route("/listsongbymood")
  .post(authenticateJwt, userController.ListSongByMood);
router
  .route("/listtransaction")
  .post(authenticateJwt, userController.ListTransactionByUser);

module.exports = router;
