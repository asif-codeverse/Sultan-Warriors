const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  journalEntries: [String],
  moodHistory: [{ mood: String, date: Date }],
  crisisFlag: {
    type: Boolean,
    default: false,
  },
});

// Hash password before saving (bcryptjs)
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  // Hash the password using bcryptjs
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (password) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
