const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 100,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
  role: {
    type: String,
    required: true,
    max: 30,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(tz);
module.exports = mongoose.model('User', userSchema);
