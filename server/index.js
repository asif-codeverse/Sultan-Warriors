// 🌐 Core Dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");

// 📦 Models & AI Modules
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const { detectEmotionFromBase64, detectEmotion } = require("../ai-model/facePlus");

// 🧳 App Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 📡 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🧰 Middleware Setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

// 🧳 Multer Setup for File Uploads
const upload = multer({ dest: "uploads/" });

// 🖼 View Engine (EJS) Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));

/* ============================================================================ 
   📊 ROUTES 
============================================================================ */

// 📍 Home/Dashboard
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const appointments = await Appointment.find().populate("userId").exec();
    res.render("index", { users, appointments });
  } catch (err) {
    console.error("❌ Error fetching dashboard data:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 👤 Add New User
app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error adding user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 📅 Book Appointment
app.post("/book", async (req, res) => {
  try {
    const { userId, therapistName, date } = req.body;
    const appointment = new Appointment({ userId, therapistName, date });
    await appointment.save();
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error booking appointment:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🔁 Update Appointment Status
app.post("/appointment/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) return res.status(404).send("Appointment not found");

    res.redirect("/");
  } catch (err) {
    console.error("❌ Error updating status:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// ❌ Delete Appointment
app.delete("/appointment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).send("Appointment not found");

    res.send({ message: "✅ Appointment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting appointment:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🧠 Emotion Detection via Base64 (Webcam)
app.post("/api/emotion", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).send("Image is required");

    const emotionData = await detectEmotionFromBase64(imageBase64);
    res.json({ emotionData });
  } catch (err) {
    console.error("❌ Emotion Detection Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// 🖼 Emotion Detection via Image Upload
app.post("/detect-emotion", upload.single("photo"), async (req, res) => {
  try {
    const emotionData = await detectEmotion(req.file.path);
    res.json({ success: true, emotion: emotionData });
  } catch (err) {
    console.error("❌ Emotion Detection Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/* ============================================================================ 
   🚀 Start Server 
============================================================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
