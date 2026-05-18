const express = require("express");
const router = express.Router();

const multer = require("multer");
const {
  uploadImage,
  getAlbumImages,
  toggleFavorite,
  getFavoriteImages,
  getAllImagesByOwner,
  getImageById,
  updateImageDetails,
  addComment,
  deleteImage,
} = require("../controller/image.controller");

// multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route
router.post("/albums/:albumId/images", upload.single("image"), uploadImage);

router.get("/albums/:albumId/images", getAlbumImages);

router.patch("/images/:imageId/favorite", toggleFavorite);

router.get("/favorites", getFavoriteImages);

router.get("/images", getAllImagesByOwner);

router.get("/images/:imageId", getImageById);

router.patch("/images/:imageId", updateImageDetails);

router.post("/images/:imageId/comments", addComment);

router.delete("/images/:imageId", deleteImage);

module.exports = router;
