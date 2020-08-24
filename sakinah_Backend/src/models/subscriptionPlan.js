const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  planName: String,
  planValidity: String,
  planUnit: String,
  planMRP: Number,
  planPrice: Number,
  currencyUnit: String,
  isEnabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("Subscriptionplan", subscriptionPlanSchema);
