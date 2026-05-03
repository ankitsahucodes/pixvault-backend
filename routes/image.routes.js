const express = require("express");
const router = express.Router();

const multer = require("multer");
const { uploadImage } = require("../controller/image.controller");
// const { verifyUser } = require("../middleware/auth.middleware");

// multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route
router.post(
  "/albums/:albumId/images",
  upload.single("image"),
  uploadImage
);

module.exports = router;