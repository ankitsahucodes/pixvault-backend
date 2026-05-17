const express = require("express");
const router = express.Router();

const multer = require("multer");
const { uploadImage, getAlbumImages, toggleFavorite, getFavoriteImages } = require("../controller/image.controller");

// multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route
router.post(
  "/albums/:albumId/images",
  upload.single("image"),
  uploadImage
);

router.get(
  "/albums/:albumId/images",
  getAlbumImages
);

router.patch(
  "/images/:imageId/favorite",
  toggleFavorite
);

router.get(
  "/favorites",
  getFavoriteImages
);

module.exports = router;