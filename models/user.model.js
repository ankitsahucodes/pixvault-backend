const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Pixvault_User = mongoose.model("Pixvault_User", userSchema);
module.exports = Pixvault_User;
