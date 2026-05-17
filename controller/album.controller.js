const Album = require("../models/album.model");

// create a new album

async function createAlbum(newAlbum) {
  try {
    const album = new Album(newAlbum);
    const savedAlbum = await album.save();
    return savedAlbum;
  } catch (error) {
    throw error;
  }
}

async function getAllAlbums(userId) {
  try {
    const albums = await Album.find({
  owner: userId,
});
    // console.log(albums);
    return albums;
  } catch (error) {
    throw error;
  }
}

async function updateAlbum(albumId, updatedData) {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, updatedData, {
      new: true,
      runValidators: true,
    });
    return updatedAlbum;
  } catch (error) {
    throw error;
  }
}

async function deleteAlbum(albumId) {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(albumId);
    return deletedAlbum;
    } catch (error) {
    throw error;
    }
}


module.exports = { createAlbum, getAllAlbums, updateAlbum, deleteAlbum };
