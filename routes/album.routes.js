const express = require("express");
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
} = require("../controller/album.controller");

// Create a new album
router.post("/", async (req, res) => {
  try {
    const savedAlbum = await createAlbum(req.body);
    res
      .status(201)
      .json({ message: "Album added Successfully", album: savedAlbum });
  } catch (error) {
    res.status(500).json({ error: "Failed to create album" });
  }
});

router.get("/", async (req, res) => {
  try {
    const albums = await getAllAlbums();

    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

router.put("/:albumId", async (req, res) => {
  try {
    const updatedAlbum = await updateAlbum(req.params.albumId, req.body);
    if (!updatedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    } else {
      res
        .status(200)
        .json({ message: "Album updated successfully", album: updatedAlbum });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update album" });
  }
});

router.delete("/:albumId", async (req, res) => {
  try {
    const deletedAlbum = await deleteAlbum(req.params.albumId);
    if (!deletedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    } else {
      res
        .status(200)
        .json({ message: "Album deleted successfully", album: deletedAlbum });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete album" });
  }
});

module.exports = router;
