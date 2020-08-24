const nodemailer = require("nodemailer");
const utils = require("../../config/utils");
const User = require("../models/user");
const Mood = require("../models/mood");
const Song = require("../models/song");
const Superadmin = require("../models/superadmin");
const Subscriptionplan = require("../models/subscriptionPlan");
const Transaction = require("../models/transaction");
const fs = require("fs");
const path = require("path");
const pathToKey = path.join(__dirname, "../..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");
const jwt = require("jsonwebtoken");
var ba64 = require("ba64");
const {
  ListAllUser
} = require("../controllers/superadmin/superadminController");
const UserService = {
  sendMail(mailOptions) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
      }
    });
    // var transporter = nodemailer.createTransport({
    //   host: "smtp-mail.outlook.com", // hostname
    //   secureConnection: false, // TLS requires secureConnection to be false
    //   port: 587, // port for secure SMTP
    //   tls: {
    //     ciphers: "SSLv3"
    //   },
    //   auth: {
    //     user: process.env.MAILER_EMAIL,
    //     pass: process.env.MAILER_PASSWORD
    //   }
    // });
    // var transporter = nodemailer.createTransport({
    //   service: "outlook",
    //   auth: {
    //     user: process.env.MAILER_EMAIL,
    //     pass: process.env.MAILER_PASSWORD
    //   }
    // });
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
  },
  getTokenInformation(headers) {
    var verifyOptions = {
      algorithm: ["RS256"]
    };
    let token;
    if (headers.authorization && headers.authorization.startsWith("Bearer")) {
      token = headers.authorization.split(" ")[1];
    } else {
      token = null;
      return token;
    }
    const legit = jwt.verify(token, PUB_KEY, verifyOptions);
    return legit;
  },
  async registerAdmin(admin) {
    const saltHash = utils.genPassword(admin.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newAdmin = new Superadmin({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      hash: hash,
      salt: salt
    });
    const savedAdmin = await newAdmin.save();

    return savedAdmin;
  },
  async loginAdmin(admininfo) {
    const admin = await Superadmin.findOne({ email: admininfo.email });
    if (admin) {
      const isValid = utils.validPassword(
        admininfo.password,
        admin.hash,
        admin.salt
      );
      var returnObject = {};
      returnObject.isValid = isValid;
      if (isValid) {
        returnObject.user = admin;
      }
      return returnObject;
    } else {
      return null;
    }
  },
  async registerUser(user) {
    const saltHash = utils.genPassword(user.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      hash: hash,
      salt: salt
    });
    const savedUser = await newUser.save();
    return savedUser;
  },
  async verifyUser(email) {
    const filter = { email: email };
    const update = { isVerified: true };
    let doc = await User.findOneAndUpdate(filter, update, {
      new: true
    });
    return doc;
  },
  async loginUser(userinfo) {
    const user = await User.findOne({ email: userinfo.email });
    if (user) {
      const isValid = utils.validPassword(
        userinfo.password,
        user.hash,
        user.salt
      );
      console.log(isValid);
      var returnObject = {};
      returnObject.isValid = isValid;
      if (isValid) {
        returnObject.user = user;
      }
      return returnObject;
    } else {
      return null;
    }
  },
  generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },
  verifyOTP(requestOTP, responseOTP) {
    if (requestOTP === responseOTP) {
      return true;
    } else {
      return false;
    }
  },
  async findUser(email) {
    const user = await User.findOne({ email: email });
    return user;
  },
  async findUserById(id) {
    const user = await User.findOne(
      { _id: id },
      {
        salt: 0,
        hash: 0
      }
    );
    return user;
  },
  async updatePassword(newpassword, userEmail) {
    const saltHash = utils.genPassword(newpassword);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const filter = { email: userEmail };
    const update = { salt: salt, hash: hash };
    let doc = await User.findOneAndUpdate(filter, update, {
      new: true
    });
    return doc;
  },
  async updateProfile(user, userEmail) {
    const filter = { email: userEmail };
    const update = {
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile
    };
    let doc = await User.findOneAndUpdate(filter, update, {
      new: true
    });
    return doc;
  },
  async uploadProfileImage(user, userEmail) {
    ba64.writeImage(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "sakinahdata",
        "profilepics",
        userEmail
      ),
      user.image,
      async function(err) {
        if (err) throw err;

        const filter = { email: userEmail };
        const update = {
          profilePicUrl:
            "http://35.225.89.191/data/profilepics" + userEmail + ".jpeg"
        };
        let doc = await User.findOneAndUpdate(filter, update, {
          new: true
        });
        return doc;
      }
    );
  },
  async listMood() {
    const mood = await Mood.find();
    return mood;
  },
  async listMoodById(moodId) {
    const mood = await Mood.findOne({ _id: moodId });
    return mood;
  },
  async addMood(mood) {
    const newMood = new Mood({
      moodName: mood.moodName
    });
    const savedMood = await newMood.save();

    return savedMood;
  },
  async updateMood(mood) {
    const filter = { _id: mood.moodId };
    const update = { moodName: mood.moodName };

    let doc = await Mood.findOneAndUpdate(filter, update, {
      new: true
    });

    return doc;
  },
  async activateMood(mood) {
    const filter = { _id: mood.moodId };
    const update = { isEnabled: mood.isEnabled };

    let doc = await Mood.findOneAndUpdate(filter, update, {
      new: true
    });

    return doc;
  },
  async assignMoodImage(moodId, moodImage) {
    const filter = { _id: moodId };
    const update = { moodImage: moodImage };
    let doc = await Mood.findOneAndUpdate(filter, update, {
      new: true
    });
    return doc;
  },
  async addSong(moodId, isPreview, songUrl, title) {
    const newSong = new Song({
      moodId: moodId,
      title: title,
      isPreview: isPreview,
      songUrl: songUrl
    });
    const savedSong = await newSong.save();

    return savedSong;
  },
  async listsongByMood(moodId) {
    const song = await Song.find({ moodId: moodId }).populate("moodId");
    return song;
  },
  async addSubscriptionPlan(subscriptionplan) {
    const newSubscriptionPlan = new Subscriptionplan({
      planName: subscriptionplan.planName,
      planValidity: subscriptionplan.planValidity,
      planUnit: subscriptionplan.planUnit,
      planMRP: subscriptionplan.planMRP,
      planPrice: subscriptionplan.planPrice,
      currencyUnit: subscriptionplan.currencyUnit
      //  isEnabled: subscriptionpla.isEnabled
    });
    const savedSubscriptionPlan = await newSubscriptionPlan.save();

    return savedSubscriptionPlan;
  },
  async listSubscriptionPlan() {
    const listSubscriptionPlan = await Subscriptionplan.find({
      isEnabled: true
    });
    return listSubscriptionPlan;
  },
  async listSubscriptionPlanById(planId) {
    const listSubscriptionPlan = Subscriptionplan.findOne({ _id: planId });
    return listSubscriptionPlan;
  },
  async updateSubscriptionPlan(subscriptionplan) {
    const filter = { _id: subscriptionplan.subscriptionPlanId };
    const update = {
      isEnabled: subscriptionplan.isEnabled,
      planName: subscriptionplan.planName,
      planValidity: subscriptionplan.planValidity,
      planUnit: subscriptionplan.planUnit,
      planMRP: subscriptionplan.planMRP,
      planPrice: subscriptionplan.planPrice,
      currencyUnit: subscriptionplan.currencyUnit
    };

    let doc = await Subscriptionplan.findOneAndUpdate(filter, update, {
      new: true
    });

    return doc;
  },
  async updateSubscriptionPlanStatus(subscriptionplan) {
    const filter = { _id: subscriptionplan.planId };
    const update = { isEnabled: subscriptionplan.isEnabled };

    let doc = await Subscriptionplan.findOneAndUpdate(filter, update, {
      new: true
    });

    return doc;
  },
  async updateSongPreviewStatus(song) {
    const filter = { _id: song.songId };
    const update = { isPreview: song.isPreview };

    let doc = await Song.findOneAndUpdate(filter, update, {
      new: true
    });

    return doc;
  },
  async createTransaction(user, transactionData, paymentGateway) {
    const newTransaction = new Transaction({
      userInfo: user._id,
      transactionDate: user.subscriptionInfo.purchaseDate,
      paymentGateway: paymentGateway,
      paymentTransactionData: transactionData,
      subscriptionPlanInfo: user.subscriptionInfo.subscriptionPlan,
      planValidFrom: user.subscriptionInfo.subscriptionStartDate,
      planValidTill: user.subscriptionInfo.subscriptionEndDate
    });
    const savedTransaction = await newTransaction.save();

    return savedTransaction;
  },
  async listAllTransaction() {
    const listTransaction = await Transaction.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userInfo",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanInfo",
          foreignField: "_id",
          as: "subscriptionPlanInfo"
        }
      },
      { $unwind: "$subscriptionPlanInfo" },

      {
        $project: {
          _id: 1,
          userInfo: 1,
          subscriptionPlanInfo: 1,
          transactionDate: 1,
          paymentGateway: 1,
          paymentTransactionData: 1,
          planValidFrom: 1,
          planValidTill: 1,
          comments: 1
        }
      }
    ]).exec();
    return listTransaction;
  },
  async listTransactionbyuser(userId) {
    const listTransaction = await Transaction.aggregate([
      {
        $match: {
          userInfo: {
            $eq: userId
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userInfo",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanInfo",
          foreignField: "_id",
          as: "subscriptionPlanInfo"
        }
      },
      { $unwind: "$subscriptionPlanInfo" },

      {
        $project: {
          _id: 1,
          userInfo: 1,
          subscriptionPlanInfo: 1,
          transactionDate: 1,
          paymentGateway: 1,
          paymentTransactionData: 1,
          planValidFrom: 1,
          planValidTill: 1,
          comments: 1
        }
      }
    ]).exec();
    return listTransaction;
  },
  async listTransactionById(Id) {
    const listTransaction = await Transaction.aggregate([
      {
        $match: {
          _id: {
            $eq: Id
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userInfo",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanInfo",
          foreignField: "_id",
          as: "subscriptionPlanInfo"
        }
      },
      { $unwind: "$subscriptionPlanInfo" },

      {
        $project: {
          _id: 1,
          userInfo: 1,
          subscriptionPlanInfo: 1,
          transactionDate: 1,
          paymentGateway: 1,
          paymentTransactionData: 1,
          planValidFrom: 1,
          planValidTill: 1,
          comments: 1
        }
      }
    ]).exec();
    return listTransaction;
  },
  async listAllUser() {
    const user = User.find({});
    return user;
  },
  async countUser() {
    const user = await User.countDocuments();
    return user;
  },
  async songByMood() {
    const songInfo = await Song.aggregate([
      {
        $lookup: {
          from: "moods",
          localField: "moodId",
          foreignField: "_id",
          as: "moodId"
        }
      },
      {
        $unwind: "$moodId"
      },
      {
        $group: {
          _id: "$moodId.moodName",
          // moodData: "$moodId.moodName",
          count: { $sum: 1 }
        }
      }
    ]);
    return songInfo;
  },
  async revenueGeneratedByMonth() {
    const listTransaction = await Transaction.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userInfo",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "subscriptionPlanInfo",
          foreignField: "_id",
          as: "subscriptionPlanInfo"
        }
      },
      { $unwind: "$subscriptionPlanInfo" },

      {
        $group: {
          _id: 1,
          total: { $sum: "$subscriptionPlanInfo.planPrice" }
        }
      }
    ]).exec();
    return listTransaction;
  }
};
module.exports = UserService;
