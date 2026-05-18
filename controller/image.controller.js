const ImageModel = require("../models/image.model");
const cloudinary = require("../config/cloudinary");
const Album = require("../models/album.model");

// Upload Image to Album
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
    const album = await Album.findById(req.params.albumId);

    const images = await ImageModel.find({
      album: req.params.albumId,
    });

    res.status(200).json({ album, images });
  } catch (error) {
    console.error("Error fetching images:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch images",
    });
  }
};

// Get all images by owner

const getAllImagesByOwner = async (req, res) => {
  try {
    const images = await ImageModel.find().populate({
      path: "album",
      match: {
        owner: req.user.userId,
      },
    });

    // remove unmatched images
    const filteredImages = images.filter((image) => image.album !== null);

    res.status(200).json(filteredImages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch images",
    });
  }
};

// Add / Remove from Favorites
const toggleFavorite = async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.imageId);

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

// Show All Favorite Images
const getFavoriteImages = async (req, res) => {
  try {
    const images = await ImageModel.find({
      isFavorite: true,
    }).populate({
      path: "album",
      match: {
        owner: req.user.userId,
      },
    });

    const filteredImages = images.filter((img) => img.album !== null);

    res.status(200).json(filteredImages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch favorites",
    });
  }
};

// Get Image by ID

const getImageById = async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.imageId)
      .populate("album")
      .populate("comments.user", "name email");

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.status(200).json(image);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch image",
    });
  }
};

// Update Image Details (Person, Tags)

const updateImageDetails = async (req, res) => {
  try {
    const { person, tags } = req.body;

    const updatedImage = await ImageModel.findByIdAndUpdate(
      req.params.imageId,
      {
        person,
        tags,
      },
      {
        new: true,
      },
    );

    if (!updatedImage) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update image",
    });
  }
};

// add Comment to Image

const addComment = async (req, res) => {
  try {

    const image = await ImageModel.findById(
      req.params.imageId
    );

    image.comments.push({
      text: req.body.text,
      user: req.user.userId,
    });

    await image.save();

    res.status(200).json({
      message: "Comment added",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to add comment",
    });
  }
};


// delete Image

const deleteImage = async (req, res) => {
  try {

    const deletedImage =
      await ImageModel.findByIdAndDelete(
        req.params.imageId
      );

    if (!deletedImage) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.status(200).json({
      message: "Image deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to delete image",
    });
  }
};


module.exports = {
  uploadImage,
  getAlbumImages,
  toggleFavorite,
  getFavoriteImages,
  getAllImagesByOwner,
  getImageById,
  updateImageDetails,
  addComment,
  deleteImage,
};
