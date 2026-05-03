const ImageModel = require("../models/image.model");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "album_images",
    });

    const newImage = new ImageModel({
      url: result.secure_url,
      album: req.params.albumId,
      name: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { uploadImage };
