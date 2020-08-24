const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  songUrl: String,
  title: String,
  isPreview: { type: Boolean, default: false },
  moodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mood"
  }
});

module.exports = mongoose.model("Song", songSchema);
