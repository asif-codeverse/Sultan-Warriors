const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  moodHistory: [
    {
      mood: String,
      date: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
