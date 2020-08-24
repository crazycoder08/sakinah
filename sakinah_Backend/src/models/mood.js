const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  moodName: String,
  moodImage: String,
  isEnabled: { type: Boolean, default: false },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ]
});

module.exports = mongoose.model("Mood", moodSchema);
