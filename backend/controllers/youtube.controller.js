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
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const oauth2callback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await getAccessToken(code);
    req.session.youtube_accessToken = tokens.access_token;
    req.session.youtube_refreshToken = tokens.refresh_token;
    console.log("Tokens: ", tokens);
    req.session.youtube_expiresIn = tokens.expiry_date;
    req.session.youtube_tokenReceivedAt = Date.now();
    console.log("Expires in ", req.session.youtube_expiresIn);
    console.log("Access token: ", req.session.youtube_accessToken);
    console.log("Refresh token: ", req.session.youtube_refreshToken);
    const frontendUrl =
      process?.env?.NODE_ENV === "development"
        ? "http://localhost:3000/transfer"
        : "https://music-yt-spotify-rc.onrender.com/transfer";
    res.redirect(frontendUrl);
  } catch (err) {
    console.error("Error in callback ", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
export const getAuthenticated = async (req, res) => {
  try {
    if (req.session.youtube_accessToken) {
      res.status(200).json({ authenticated: true });
    }
    res.status(401).json({ authenticated: false });
  } catch (err) {
    console.error("Error in isLoggedIn", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const searchAndAddToPlaylist = async (req, res) => {
  const { songs, youtubePlaylistId } = req.body;
  const accessToken = req.session.youtube_accessToken;

  console.log("Searching " + songs.length + " songs");

  if (songs.length === 0 || !songs) {
    console.log("No songs provided");
    return res.status(400).json({ error: "No songs provided" });
  }

  try {
    const unAddedTracks = songs.slice(); // Create a copy of songs to mark as unAdded initially
    const addedTracks = [];

    for (let i = 0; i < unAddedTracks.length; i++) {
      const song = unAddedTracks[i];
      const duration = song.duration;
      const album = song.album;
      const trackString = song.trackString;

      console.log(
        `Processing song ${i + 1} of ${unAddedTracks.length}:`,
        trackString
      );

      try {
        const searchResult = await searchYoutube(
          accessToken,
          trackString,
          album,
          duration
        );

        if (searchResult) {
          const trackId = searchResult.trackId;
          const addedTrack = await addTracksToPlaylist(
            accessToken,
            youtubePlaylistId,
            trackId
          );
          addedTracks.push({
            addedTrack,
            searchResult,
          });

          // Remove the song from unAddedTracks after successfully adding it
          unAddedTracks.splice(i, 1);
          i--; // Adjust index because we removed an element
        } else {
          console.error(
            `Error processing song '${trackString}': No search result found`
          );
        }
      } catch (error) {
        console.error(`Error processing song '${trackString}':`, error.message);
      }
    }

    res
      .status(200)
      .json({ addedSongs: addedTracks, unAddedSongs: unAddedTracks });
  } catch (error) {
    console.error(
      "Error searching and adding songs to playlist:",
      error.message
    );
    res.status(500).json({ error: "Failed to process songs" });
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
  } catch (err) {
    console.error("Error in search ", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
    res.status(500).json({ error: err.message || c "Internal Server Error" });
  }
}; */
