import {
  getAccessToken,
  getUserPlaylists,
  getSavedTracks,
  createPlaylist,
  getUserData,
  addTracksToPlaylist,
  newAccessToken,
  getPlaylistItems,
} from "../services/spotify.service.js";

export const login = (req, res) => {
  try {
    const scope =
      "user-read-private user-read-email playlist-read-private user-library-read playlist-read-collaborative playlist-modify-public playlist-modify-private";
    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${
      process.env.SPOTIFY_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.SPOTIFY_REDIRECT_URL
    )}&scope=${scope}`;
    res.redirect(authorizeUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const callback = async (req, res) => {
  const code = req.query.code;
  try {
    const { accessToken, refreshToken, expiresIn } = await getAccessToken(code);
    req.session.accessToken = accessToken;
    req.session.expiresIn = expiresIn;
    req.session.refreshToken = refreshToken;
    req.session.tokenReceivedAt = Date.now();
    console.log(req.session.tokenReceivedAt, " ", req.session.expiresIn);
    console.log(req.session.tokenReceivedAt + req.session.expiresIn * 1000);
    const user = await getUserData(req.session.accessToken);
    req.session.spotifyUser = user;
    console.log(req.session.spotifyUser);

    const frontendUrl = "https://music-yt-spotify-rc.onrender.com/transfer";
    res.redirect(frontendUrl);
  } catch (err) {
    console.error("Error exchanging code for access token ", err.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to authenticate with Spotify" });
  }
};

export const getUserPlaylist = async (req, res) => {
  try {
    const playlists = await getUserPlaylists(req.session.accessToken);
    res.status(200).json({ playlists });
  } catch (err) {
    console.error("Error fetching user playlists from Spotify: ", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch user playlist from Spotify" });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const name = "Liked Songs Playlist";
    const userId = req.session.spotifyUser.id; //Spotify user information

    console.log(req.session.spotifyId);

    const playlistId = await createPlaylist(
      req.session.accessToken,
      userId,
      name
    );
    const tracks = await getSavedTracks(req.session.accessToken, playlistId);
    console.log("Liked songs playlist created with ID: ", tracks);
    const newPlaylist = await addTracksToPlaylist(
      req.session.accessToken,
      playlistId,
      tracks
    );
    res.status(200).json({ newPlaylist });
  } catch (err) {
    console.error("Error fetching saved tracks from Spotify: ", err.message);
    res.status(500).json({
      error: err.message || "Failed to fetch saved tracks from Spotify",
    });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.session.refreshToken;
  try {
    const { accessToken } = await newAccessToken(refreshToken);
    req.session.accessToken = accessToken;
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("Error in refresh token : ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuthenticated = async (req, res) => {
  const now = Date.now();
  const expiryTime = req.session.tokenReceivedAt + req.session.expiresIn * 1000;
  if (now < expiryTime) {
    res.status(200).json({ authenticated: true });
  }
  res.status(400).json({ authenticated: false });
};

export const getTrackInfo = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const tracks = await getPlaylistItems(req.session.accessToken, playlistId);
    console.log(tracks[1]);
    if (!tracks || tracks.length === 0) {
      console.log(`No tracks found in playlist ${playlistId}`);
      res.status(404).json({ error: "No tracks found in playlist" });
    }

    const trackInfo = tracks.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists,
      album: item.track.album.name,
      duration: item.track.duration_ms,
      preview_url: item.track.preview_url,
      external_urls: item.track.external_urls.spotify,
      popularity: item.track.popularity,
      is_local: item.is_local,
      image_url:
        item.track.album.images.length > 0
          ? item.track.album.images[0].url
          : null,
    }));

    res.status(200).json(trackInfo);
  } catch (err) {
    console.error("Error fetching track info: ", err.message);
    res.status(500).json({ error: "Failed to fetch track info from Spotify" });
  }
};

export const isLoggedIn = async (req, res) => {
  if (req.session.accessToken) {
    res.status(200).json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
};
