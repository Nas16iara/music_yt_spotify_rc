import express from "express";
import {
  login,
  callback,
  getUserPlaylist,
  getLikedSongs,
  getAuthenticated, // returns if there is an access token or not
  getTrackInfo, // returns track information given an id
} from "../controllers/spotify.controller.js";

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/playlists", getUserPlaylist); // returns all of the users playlist
router.get("/tracks/:playlistId", getTrackInfo);
router.get("/liked-songs", getLikedSongs); // if the user wants the tracks in liked-songs list
router.get("/authenticated", getAuthenticated);

//TODO: add a route that gets playlist id and return track information [artist, date, name, ect...]

export default router;
