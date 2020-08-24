const mongoose = require("mongoose");
var UserSubscriptionInfo = mongoose.Schema({
  transactionRef: mongoose.Schema.Types.Mixed,
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriptionplan"
  },
  subscriptionStartDate: String,
  subscriptionEndDate: String,
  subscriptionActive: Boolean,
  purchaseDate: String
});
var UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: Number,
  email: String,
  hash: String,
  salt: String,
  profilePicUrl: String,
  isVerified: { type: Boolean, default: false },
  subscriptionInfo: UserSubscriptionInfo
});
module.exports = mongoose.model("User", UserSchema);
