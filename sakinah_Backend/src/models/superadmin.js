const mongoose = require("mongoose");

const SuperadminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  hash: String,
  salt: String
});

module.exports = mongoose.model("Superadmin", SuperadminSchema);
