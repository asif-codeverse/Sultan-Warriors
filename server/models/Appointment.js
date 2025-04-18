const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  therapistName: String,
  date: Date,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
