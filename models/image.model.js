const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const imageSchema = new mongoose.Schema(
  {
    imageId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    url: { type: String, required: true },

    name: {
      type: String,
      required: true,
    },

    tags: [String],

    person: {
      type: String,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    comments: [
      {
        text: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pixvault_User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    size: {
      type: Number,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PixVault_Images", imageSchema);
