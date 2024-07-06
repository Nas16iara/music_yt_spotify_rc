// youtube.routes.js
import express from "express";
import {
  login,
  oauth2callback,
  createPlaylist,
  getAuthenticated,
  searchAndAddToPlaylist,
  getExistingPlaylist,
} from "../controllers/youtube.controller.js";

const router = express.Router();

router.get("/login", login);
router.get("/authenticated", getAuthenticated);
router.get("/callback", oauth2callback);
router.post("/createPlaylist", createPlaylist);
router.post("/getPlaylist", getExistingPlaylist);
router.post("/addTracks", searchAndAddToPlaylist);

export default router;
