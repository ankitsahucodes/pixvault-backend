const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const albumSchema = new mongoose.Schema(
  {
    albumId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pixvault_User",
      required: true,
    },
     sharedUsers: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Album", albumSchema);
