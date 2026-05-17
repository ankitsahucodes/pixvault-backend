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

// Get Images of Particular Album
const getAlbumImages = async (req, res) => {
  try {

    const images = await ImageModel.find({
      album: req.params.albumId,
    });

    res.status(200).json(images);

  } catch (error) {

    console.error("Error fetching images:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch images",
    });
  }
};


const toggleFavorite = async (req, res) => {
  try {

    const image = await ImageModel.findById(
      req.params.imageId
    );

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    image.isFavorite = !image.isFavorite;

    await image.save();

    res.status(200).json(image);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to update favorite",
    });
  }
};


const getFavoriteImages = async (req, res) => {
  try {

    const images = await ImageModel.find({
  isFavorite: true,
})
.populate({
  path: "album",
  match: {
    owner: req.user.userId,
  },
});

const filteredImages = images.filter(
      (img) => img.album !== null
    );


    res.status(200).json(filteredImages);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch favorites",
    });
  }
};

module.exports = { uploadImage, getAlbumImages, toggleFavorite, getFavoriteImages };
