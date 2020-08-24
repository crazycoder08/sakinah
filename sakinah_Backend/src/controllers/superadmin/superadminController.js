const Superadmin = require("../../models/superadmin");
const Mood = require("../../models/mood");
const Song = require("../../models/song");
const utils = require("../../../config/utils");
const Constant = require("../../../config/constant");
const service = require("../../services/services");
const { google } = require("googleapis");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const pathToKey = path.join(__dirname, "../../..", "token.json");
const token = fs.readFileSync(pathToKey, "utf-8");

const oauth2Client = new google.auth.OAuth2();
oauth2Client.setCredentials({
  refresh_token: JSON.parse(token).refresh_token
});
oauth2Client.setCredentials({
  access_token: JSON.parse(token).access_token
});
exports.Register = async function(req, res) {
  const superAdmin = await service.registerAdmin(req.body);
  if (!superAdmin)
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_NOT_FOUND,
      msg: "Error occured"
    });
  else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: superAdmin,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  }
};
exports.Login = async function(req, res) {
  const returnedObject = await service.loginAdmin(req.body);
  if (returnedObject && returnedObject.isValid) {
    const tokenObject = utils.issueJWT(returnedObject.user, "ADMIN");
    res.status(Constant.resCode.HTTP_OK).json({
      code: Constant.resCode.HTTP_OK,
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires
    });
  } else {
    res.status(Constant.resCode.HTTP_OK).json({
      success: false,
      code: Constant.resCode.HTTP_UNAUTHORIZED,
      msg: "you entered the wrong email/password"
    });
  }
};

exports.ListMoods = async function(req, res) {
  const moodsList = await service.listMood();
  return res.status(Constant.resCode.HTTP_OK).json({
    data: moodsList,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
// exports.AddMood = async function(req, res) {
//   const moodsData = await service.addMood(req.body);
//   return res.status(Constant.resCode.HTTP_OK).json({
//     data: moodsData,
//     code: Constant.resCode.HTTP_OK,
//     msg: "Success"
//   });
// };
exports.UpdateMood = async function(req, res) {
  console.log(req.body);
  const moodsData = await service.updateMood(req.body);
  return res.status(Constant.resCode.HTTP_OK).json({
    data: moodsData,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.ListMoodsById = async function(req, res) {
  const moodsData = await service.listMoodById(req.body.moodId);
  return res.status(Constant.resCode.HTTP_OK).json({
    data: moodsData,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.ActivateMood = async function(req, res) {
  const moodsData = await service.activateMood(req.body);
  return res.status(Constant.resCode.HTTP_OK).json({
    data: moodsData,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};

exports.AddMood = async function(req, res) {
  var form = new formidable.IncomingForm();
  var moodName = "";
  form.parse(req);
  form.on("field", function(name, field) {
    moodName = field;
  });

  form.on("fileBegin", function(name, file) {});
  form.parse(req, function(err, fields, files) {
    var oldPath = files.moodPic.path;
    var newPath =
      path.join(__dirname, "..", "..", "..", "..", "sakinahdata", "moodspics") +
      "/" +
      files.moodPic.name;
    var rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, async function(err) {
      if (err) console.log(err);

      const fileUrl =
        "http://35.225.89.191/data/moodspics/" + files.moodPic.name;
      const newMood = new Mood({
        moodName: moodName,
        moodImage: fileUrl,
        isEnabled: true
      });
      const savedMood = await newMood.save();
      return res.status(200).json({
        data: savedMood,
        code: Constant.resCode.HTTP_OK,
        msg: "Success"
      });
    });
  });
};
exports.AddMoodWithUrl = async function(req, res) {
  const newMood = new Mood({
    moodName: req.body.moodName,
    moodImage: req.body.fileUrl,
    isEnabled: true
  });
  const savedMood = await newMood.save();
  return res.status(200).json({
    data: savedMood,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.UpdateMoodWithImage = async function(req, res) {
  const filter = { _id: req.body.moodId };
  const update = { moodName: req.body.moodName, moodImage: req.body.moodPic };

  let doc = await Mood.findOneAndUpdate(filter, update, {
    new: true
  });

  return res.status(200).json({
    data: doc,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
  // var form = new formidable.IncomingForm();
  // var moodName = "";
  // var obj = {};
  // form.parse(req);
  // form.on("field", function(name, field) {
  //   moodName = field;
  //   console.log(name + "--->" + field);
  //   obj[name] = field;
  // });

  // form.on("fileBegin", function(name, file) {});
  // form.parse(req, function(err, fields, files) {
  //   var oldPath = files.moodPic.path;
  //   var newPath =
  //     path.join(__dirname, "..", "..", "..", "..", "sakinahdata", "moodspics") +
  //     "/" +
  //     files.moodPic.name;
  //   var rawData = fs.readFileSync(oldPath);

  //   fs.writeFile(newPath, rawData, async function(err) {
  //     if (err) console.log(err);

  //     const fileUrl =
  //       "http://35.225.89.191/data/moodspics/" + files.moodPic.name;
  //     const filter = { _id: obj.moodId };
  //     const update = { moodName: obj.moodName, moodImage: fileUrl };

  //     let doc = await Mood.findOneAndUpdate(filter, update, {
  //       new: true
  //     });

  //     return res.status(200).json({
  //       data: doc,
  //       code: Constant.resCode.HTTP_OK,
  //       msg: "Success"
  //     });
  //   });
  // });
};
exports.DeleteMood = async function(req, res) {
  const deleted = await Mood.findOneAndDelete({ _id: req.body.moodId });
  const deletedSong = await Song.deleteMany({ moodId: req.body.moodId });
  return res.status(200).json({
    data: deleted,
    code: Constant.resCode.HTTP_OK,
    msg: "Successfully deleted"
  });
};
exports.DeleteSong = async function(req, res) {
  const deleted = await Song.findOneAndDelete({ _id: req.body.songId });
  return res.status(200).json({
    data: deleted,
    code: Constant.resCode.HTTP_OK,
    msg: "Successfully deleted"
  });
};
exports.UploadMoodSong = async function(req, res) {
  const savedSong = await service.addSong(
    req.body.moodId,
    req.body.isPreview,
    req.body.songUrl,
    req.body.songTitle
  );
  return res.status(200).json({
    data: savedSong,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
  // var form = new formidable.IncomingForm();
  // var moodID = "";
  // var isPreview = true;
  // form.parse(req);
  // form.on("field", function(name, field) {
  //   // moodID = field;
  //   console.log(name + "--->" + field);
  //   if (name == "moodId") {
  //     moodID = field;
  //   } else if (name == "isPreview") {
  //     isPreview = field;
  //   }
  // });
  // form.parse(req, function(err, fields, files) {
  //   var oldPath = files.song.path;
  //   var newPath =
  //     path.join(__dirname, "..", "..", "..", "..", "sakinahdata", "songs") +
  //     "/" +
  //     files.song.name;
  //   var rawData = fs.readFileSync(oldPath);

  //   fs.writeFile(newPath, rawData, async function(err) {
  //     if (err) console.log(err);
  //     console.log(moodID);
  //     const fileUrl = "http://35.225.89.191/data/songs/" + files.song.name;
  //     const savedSong = await service.addSong(
  //       moodID,
  //       isPreview,
  //       fileUrl,
  //       files.song.name
  //     );
  //     return res.status(200).json({
  //       data: savedSong,
  //       code: Constant.resCode.HTTP_OK,
  //       msg: "Success"
  //     });
  //   });
  // });
  // form.on("fileBegin", function(name, file) {});
};
exports.ListSubscriptionPlan = async function(req, res) {
  const planList = await service.listSubscriptionPlan();
  return res.status(Constant.resCode.HTTP_OK).json({
    data: planList,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.ListSubscriptionPlanById = async function(req, res) {
  const planDetail = await service.listSubscriptionPlanById(
    req.body.subscriptionPlanId
  );
  return res.status(Constant.resCode.HTTP_OK).json({
    data: planDetail,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.AddNewSubscriptionPlan = async function(req, res) {
  const subscriptionPlan = await service.addSubscriptionPlan(req.body);
  return res.status(Constant.resCode.HTTP_OK).json({
    data: subscriptionPlan,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
exports.UpdateSubscriptionPlan = async function(req, res) {
  const updateSubscriptionPlan = await service.updateSubscriptionPlan(req.body);
  if (updateSubscriptionPlan) {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: updateSubscriptionPlan,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_NOT_FOUND,
      msg: "NOT Found"
    });
  }
};
exports.UpdateSongPreviewStatus = async function(req, res) {
  const updateSongPreviewStatus = await service.updateSongPreviewStatus(
    req.body
  );
  if (updateSongPreviewStatus) {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: updateSongPreviewStatus,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_NOT_FOUND,
      msg: "NOT Found"
    });
  }
};
exports.UpdateSubscriptionPlanStatus = async function(req, res) {
  const updateSubscriptionPlanStatus = await service.updateSubscriptionPlanStatus(
    req.body
  );
  if (updateSubscriptionPlanStatus) {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: updateSubscriptionPlanStatus,
      code: Constant.resCode.HTTP_OK,
      msg: "Success"
    });
  } else {
    return res.status(Constant.resCode.HTTP_OK).json({
      data: null,
      code: Constant.resCode.HTTP_NOT_FOUND,
      msg: "NOT Found"
    });
  }
};
exports.ListSongByMood = async function(req, res) {
  const songList = await service.listsongByMood(req.body.moodId);
  if (songList) {
    res.status(200).json({
      data: songList,
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
exports.ListAllTransaction = async function(req, res) {
  transactionList = await service.listAllTransaction();
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
};
exports.ListTransactionById = async function(req, res) {
  transactionList = await service.listTransactionById(req.body.transactionId);
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
};
exports.ListAllUser = async function(req, res) {
  transactionList = await service.listAllUser();
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
};
exports.HomeScreen = async function(req, res) {
  var homeScreenObject = {};
  const userCount = await service.countUser();
  const songByMood = await service.songByMood();
  const revenueDetail = await service.revenueGeneratedByMonth();
  homeScreenObject["userCount"] = userCount;
  homeScreenObject["songByMood"] = songByMood;
  homeScreenObject["revenueDetail"] = revenueDetail;
  return res.status(Constant.resCode.HTTP_OK).json({
    data: homeScreenObject,
    code: Constant.resCode.HTTP_OK,
    msg: "Success"
  });
};
