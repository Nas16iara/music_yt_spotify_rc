//youtube.controller.js
import {
  generateAuthUrl,
  getAccessToken,
  addTracksToPlaylist,
  createPlaylists,
  searchYoutube,
  getExistingPlaylists,
} from "../services/youtube.service.js";

export const login = async (req, res) => {
  try {
    console.log("Enter Login");
    const authUrl = await generateAuthUrl();
    res.redirect(authUrl);
  } catch (err) {
    console.error("Error in authenticate youtubeController ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const oauth2callback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await getAccessToken(code);
    req.session.youtube_accessToken = tokens.access_token;
    req.session.youtube_refreshToken = tokens.refresh_token;
    req.session.youtube_expiresIn = tokens.expiry_date;
    req.session.youtube_tokenReceivedAt = Date.now();
    console.log("Access token: ", req.session.youtube_accessToken);
    res.redirect("http://localhost:5000/transfer");
  } catch (err) {
    console.error("Error in callback ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAuthenticated = async (req, res) => {
  try {
    if (req.session.youtube_accessToken) {
      return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ authenticated: false });
  } catch (error) {
    console.error("Error in isLoggedIn", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const accessToken = req.session.youtube_accessToken;
    if (!accessToken) {
      console.error("Access token not found in session in controller");
      throw new Error("Access token not found in session in controller");
    }
    console.log("Using access token: ", accessToken);
    const playlistData = { title, description };

    const playlistItems = await createPlaylists(accessToken, playlistData);
    const playlistId = playlistItems.id;

    res.status(201).json({ playlistId });
  } catch (err) {
    console.error("Error in createPlaylist ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getExistingPlaylist = async (req, res) => {
  try {
    const { playlistName } = req.body;
    const accessToken = req.session.youtube_accessToken;
    const { playlist, playlistId } = await getExistingPlaylists(
      accessToken,
      playlistName
    );
    console.log("Existing playlist ", playlist, " with id " + playlistId);
    res.status(200).json({ playlist, playlistId });
  } catch (err) {
    console.error("Error in getExistingPlaylist", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchAndAddToPlaylist = async (req, res) => {
  const { songs, youtubePlaylistId } = req.body;
  const accessToken = req.session.youtube_accessToken;
  const errList = []; // songs that weren't able to be added to the playlist
  try {
    const addedTracks = [];

    for (let song of songs) {
      const query = `${song.artists.map((artist) => artist.name).join(",")} ${
        song.name
      } audio`;
      const duration = song.duration;
      try {
        const searchResult = await searchYoutube(accessToken, query, duration);
        if (searchResult) {
          const trackId = searchResult.trackId;
          const addedTrack = await addTracksToPlaylist(
            accessToken,
            youtubePlaylistId,
            trackId
          );
          addedTracks.push(addedTrack, searchResult.duration);
        } else {
          errList.push(song);
        }
      } catch (err) {
        console.error("Failed to add track to playlist:", err.message);
        errList.push(song);
      }
    }
    console.log("Added Tracks: ", addedTracks);
    console.log("Errors: ", errList);

    res.status(200).json({ songs: addedTracks, errorList: errList });
  } catch (err) {
    console.error("Error in searchAndAddToPlaylist", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* 
export const search = async (req, res) => {
  const { songs } = req.body;
  const accessToken = req.session.youtube_accessToken;
  try {
    const results = [];
    for (let song of songs) {
      const query = `${song.artists.map((artist) => artist.name).join(", ")} ${
        song.name
      } audio`;
      const duration = song.duration;

      const result = await searchYoutube(accessToken, query, duration);
      if (result) {
        results.push(result);
      }
    }
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in search ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId, songs } = req.body;

    const accessToken = req.session.youtube_accessToken;
    const result = await addTracksToPlaylist(accessToken, playlistId, trackIds);
    res.status(200).json({ result });
  } catch (err) {
    console.error("Error in addTracks to playlist ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}; */
