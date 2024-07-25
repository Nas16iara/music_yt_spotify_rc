import { newYoutubeAccessToken } from "../services/youtube.service.js";
import { newAccessToken } from "../services/spotify.service.js";
export const tokenExpiration = (req, res) => {
  try {
    const spotifyAccessToken = req.session.accessToken;
    const youtubeAccessToken = req.session.youtube_accessToken;

    const spotifyExpiresIn = req.session.expiresIn;
    const youtubeExpiresIn = req.session.youtube_expiresIn;

    const spotifyTokenReceived = req.session.tokenReceivedAt;
    const youtubeTokenReceived = req.session.youtube_tokenReceivedAt;

    // Check if neither Spotify nor YouTube tokens have been received
    if (!spotifyTokenReceived && !youtubeTokenReceived) {
      return res
        .status(200)
        .json({
          isSpotifyToken: false,
          isYoutubeToken: false,
          isLoggedIn: false,
        });
    }

    // Calculate expiry times in milliseconds since epoch
    const spotifyExpiryTime = spotifyTokenReceived + spotifyExpiresIn * 1000;
    const youtubeExpiryTime = youtubeTokenReceived + youtubeExpiresIn * 1000;

    // Determine if tokens are not expired (true) or expired (false)
    const isSpotifyToken = Date.now() < spotifyExpiryTime;
    const isYoutubeToken = Date.now() < youtubeExpiryTime;

    console.log(`Spotify token R: `, spotifyTokenReceived, "Now: ", Date.now());
    console.log(`YouTube token R: `, youtubeTokenReceived, "Now: ", Date.now());
    return res
      .status(200)
      .json({ isSpotifyToken, isYoutubeToken, isLoggedIn: true });
  } catch (error) {
    console.error("Error in tokenExpiration:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const tokenLogout = (req, res) => {
  try {
    delete req.session.youtube_accessToken;
    delete req.session.youtube_refreshToken;
    delete req.session.youtube_expiresIn;
    delete req.session.youtube_tokenReceivedAt;
    delete req.session.accessToken;
    delete req.session.expiresIn;
    delete req.session.refreshToken;
    delete req.session.tokenReceivedAt;
    delete req.session.spotifyUser;
    console.log("Token deleted mannn", req.session.accessToken);

    res.status(200).json({ message: "Tokens deleted successfully" });
  } catch (error) {
    console.error("Error deleting tokens:", error.message);
    res.status(500).json({ error: "Failed to delete tokens" });
  }
};
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.session.youtube_refreshToken;
    console.log("Refreshing tokens...");
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(404).json({ error: "Error logging into Youtube" });
    }
    if (!req.session.refreshToken) {
      return res.status(404).json({ error: "Error logging into Spotify" });
    }
    const { access_token, expiry_date } = await newYoutubeAccessToken(
      refreshToken
    );
    if (!access_token || !expiry_date) {
      return res.status(404).json({ error: "Failed to refresh tokens" });
    }

    req.session.youtube_accessToken = access_token;
    req.session.youtube_expiresIn = expiry_date;
    req.session.youtube_tokenReceivedAt = Date.now();

    const { accessToken, expiresIn } = await newAccessToken(refreshToken);
    if (!accessToken || !expiresIn) {
      return res.status(404).json({ error: "Failed to refresh tokens" });
    }
    req.session.accessToken = accessToken;
    req.session.expiresIn = expiresIn;
    req.session.tokenReceivedAt = Date.now();
    console.log(
      req.session.accessToken,
      req.session.expiresIn,
      req.session.tokenReceivedAt
    );
    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (err) {
    console.error("Error refreshing tokens:", err.message);
    res.status(500).json({ error: "Failed to refresh tokens" });
  }
};
