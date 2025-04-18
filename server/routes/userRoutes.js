const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/add-user", async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.send("User added");
});

module.exports = router;
