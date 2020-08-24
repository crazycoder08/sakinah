const utils = require("../../../config/utils");
const service = require("../../services/services");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Constant = require("../../../config/constant");
const { verifyUser } = require("../../services/services");
var moment = require("moment");
const { validationResult } = require("express-validator/check");
let OTPSENT = null;
const stripe = require("stripe")(
  "sk_test_51Gvq7sFq13W2av5l3FuNEBhhwTVLOF2S5kvCcPXRX3VIvuubKBLlBmGjzObizAv3fCwdYWQz5c1oninygDv5WhXl00AnjHLWvR"
);

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties

//register
exports.Register = async function(req, res) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const checkUser = await service.findUser(req.body.email);
  if (!checkUser) {
    const user = await service.registerUser(req.body);
    if (!user)
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_NOT_FOUND,
        message: "Error occured"
      });
    else {
      const OTP = await service.generateOTP();
      OTPSENT = OTP;
      var htmlText =
        "<span>Please enter <b>" + OTP + "</b> to verify your account </span>";
      const mailOptions = {
        from: process.env.MAILER_EMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Verify your Email Address", // Subject line
        html: htmlText
      };
      await service.sendMail(mailOptions);
      return res.status(Constant.resCode.HTTP_OK).json({
        data: user,
        code: Constant.resCode.HTTP_OK,
        message: "Success"
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_CONFLICT,
      message: "Email already exists"
    });
  }
};
//verify account
exports.VerifyAccount = async function(req, res) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const otpVerified = await service.verifyOTP(OTPSENT, req.body.otp);
  OTPSENT = null;
  if (otpVerified) {
    const updatedAccount = await service.verifyUser(req.body.email);
    return res.status(Constant.resCode.HTTP_OK).json({
      data: updatedAccount,
      code: Constant.resCode.HTTP_OK,
      msg: "Account verified successfully"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: otpVerified,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "OTP didnot matched"
    });
  }
};
//login
exports.Login = async function(req, res) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const returnedObject = await service.loginUser(req.body);
  if (returnedObject && returnedObject.isValid) {
    const tokenObject = utils.issueJWT(returnedObject.user, "USER");
    res.status(Constant.resCode.HTTP_OK).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires
    });
  } else {
    res
      .status(Constant.resCode.HTTP_UNAUTHORIZED)
      .json({ success: false, msg: "you entered the wrong password" });
  }
};
//reset password
exports.ResetUserPassword = async function(req, res) {
  const user = await service.findUser(req.body.email);
  if (user) {
    const OTP = await service.generateOTP();
    OTPSENT = OTP;
    var htmlText =
      "<span>Please enter <b>" +
      OTP +
      "</b> to reset password of your account </span>";
    const mailOptions = {
      from: process.env.MAILER_EMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Reset password", // Subject line
      html: htmlText
    };
    await service.sendMail(mailOptions);
    res.status(Constant.resCode.HTTP_OK).json({
      data: true,
      code: Constant.resCode.HTTP_OK,
      msg: "OTP Sent successfully"
    });
  } else {
    res.status(Constant.resCode.HTTP_OK).json({
      data: false,
      code: Constant.resCode.HTTP_NOT_FOUND,
      msg: "User Not found"
    });
  }
};
//verify otp
exports.Verifyotp = async function(req, res) {
  const otpVerified = await service.verifyOTP(OTPSENT, req.body.otp);
  OTPSENT = null;
  if (otpVerified) {
    const updatedPassword = await service.updatePassword(
      req.body.password,
      req.body.email
    );
    return res.status(Constant.resCode.HTTP_OK).json({
      data: updatedPassword,
      code: Constant.resCode.HTTP_OK,
      msg: "Password updated successfully"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: otpVerified,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "OTP didnot matched"
    });
  }
};
exports.Updatepassword = async function(req, res) {
  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const user = await service.findUserById(legit.sub);
    const isValid = utils.validPassword(
      req.body.currentPassword,
      user.hash,
      user.salt
    );
    if (isValid) {
      const updatedPassword = await service.updatePassword(
        req.body.newPassword,
        user.email
      );
      return res.status(Constant.resCode.HTTP_OK).json({
        data: updatedPassword,
        code: Constant.resCode.HTTP_OK,
        msg: "Password updated successfully"
      });
    } else {
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_UNAUTHORIZED,
        msg: "Password is incorrect"
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
exports.Updateprofile = async function(req, res) {
  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const user = await service.findUserById(legit.sub);
    if (user) {
      const updatedProfile = await service.updateProfile(req.body, user.email);
      return res.status(Constant.resCode.HTTP_OK).json({
        data: updatedProfile,
        code: Constant.resCode.HTTP_OK,
        msg: "Profile updated successfully"
      });
    } else {
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_UNAUTHORIZED,
        msg: "Something went wrong"
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
exports.Uploadprofileimage = async function(req, res) {
  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const user = await service.findUserById(legit.sub);
    if (user) {
      const updatedProfile = await service.uploadProfileImage(
        req.body,
        user.email
      );
      return res.status(Constant.resCode.HTTP_OK).json({
        data: updatedProfile,
        code: Constant.resCode.HTTP_OK,
        msg: "Profile updated successfully"
      });
    } else {
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_UNAUTHORIZED,
        msg: "Something went wrong"
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};

exports.HomeScreen = async function(req, res) {
  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const moods = await service.listMood();
    const subscriptionPlan = await service.listSubscriptionPlan();
    const user = await service.findUserById(legit.sub);

    if (user.subscriptionInfo) {
      // const curDate = new Date("2020-12-31");
      const curDate = new Date();
      if (
        curDate >= new Date(user.subscriptionInfo.subscriptionStartDate) &&
        curDate <= new Date(user.subscriptionInfo.subscriptionEndDate)
      ) {
      } else {
        user.subscriptionInfo = null;
      }
    } else {
      user.subscriptionInfo = null;
    }
    var responseObj = {};
    responseObj["user"] = user;
    responseObj["moods"] = moods;
    responseObj["subscriptionPlan"] = subscriptionPlan;

    return res.status(Constant.resCode.HTTP_OK).json({
      data: responseObj,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
exports.PurchaseSubscription = async function(req, res) {
  // verify payment

  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const plan = await service.listSubscriptionPlanById(
      req.body.subscriptionPlanId
    );
    const user = await service.findUserById(legit.sub);
    var ob = {};
    var date = new Date();
    ob["subscriptionPlan"] = plan;
    ob["subscriptionStartDate"] = new Date(date.setTime(date.getTime()));
    ob["purchaseDate"] = new Date(date.setTime(date.getTime()));
    ob["subscriptionEndDate"] = new Date(
      date.setTime(date.getTime() + parseInt(plan.planValidity) * 86400000)
    );
    user.subscriptionInfo = ob;
    const transactionHistory = await service.createTransaction(
      user,
      req.body.transactionData,
      req.body.paymentGateway
    );
    const subscribed = await user.save();
    return res.status(Constant.resCode.HTTP_OK).json({
      data: subscribed,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
exports.PayWithStripe = async function(req, res) {
  // verify payment

  const legit = service.getTokenInformation(req.headers);
  if (legit) {
    const plan = await service.listSubscriptionPlanById(
      req.body.subscriptionPlanId
    );
    const user = await service.findUserById(legit.sub);
    const token = req.body.stripeToken; // Using Express
    try {
      const customer = await stripe.customers.create({
        email: "krishrai42@gmail.com",
        source: token,
        name: "test",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US"
        }
      });

      const charge = await stripe.charges.create({
        amount: plan.planPrice * 100,
        currency: "usd",
        description: "Example charge",
        customer: customer.id
      });
      console.log(charge);
      var ob = {};
      var date = new Date();
      ob["subscriptionPlan"] = plan;
      ob["subscriptionStartDate"] = new Date(date.setTime(date.getTime()));
      ob["purchaseDate"] = new Date(date.setTime(date.getTime()));
      ob["subscriptionEndDate"] = new Date(
        date.setTime(date.getTime() + parseInt(plan.planValidity) * 86400000)
      );
      user.subscriptionInfo = ob;
      const transactionHistory = await service.createTransaction(
        user,
        charge,
        req.body.paymentGateway
      );
      const subscribed = await user.save();
      return res.status(Constant.resCode.HTTP_OK).json({
        data: subscribed,
        code: Constant.resCode.HTTP_OK,
        msg: "Success"
      });
    } catch (e) {
      console.error(e);
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_UNAUTHORIZED,
        error: e
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
exports.ListSongByMood = async function(req, res) {
  const songsList = await service.listsongByMood(req.body.moodId);
  if (songsList) {
    res.status(200).json({
      data: songsList,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    res.status(200).json({
      data: null,
      code: Constant.resCode.HTTP_NO_CONTENT,
      msg: "No song found"
    });
  }
};
exports.ListTransactionByUser = async function(req, res) {
  const legit = service.getTokenInformation(req.headers);
  console.log(legit);
  if (legit) {
    transactionList = await service.listTransactionbyuser(legit.sub);
    if (transactionList) {
      return res.status(Constant.resCode.HTTP_OK).json({
        data: transactionList,
        code: Constant.resCode.HTTP_OK,
        msg: "Success"
      });
    } else {
      return res.status(Constant.resCode.HTTP_OK).json({
        data: null,
        code: Constant.resCode.HTTP_NO_CONTENT,
        msg: "Success"
      });
    }
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "Authorization token is missing"
    });
  }
};
