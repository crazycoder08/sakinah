const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  transactionDate: Date,
  paymentGateway: String,
  paymentTransactionData: mongoose.Schema.Types.Mixed,
  subscriptionPlanInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriptionplan"
  },
  planValidFrom: Date,
  planValidTill: Date,
  comments: String
});

module.exports = mongoose.model("Transaction", transactionSchema);
