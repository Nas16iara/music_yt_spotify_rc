import { newYoutubeAccessToken } from "../services/youtube.service.js";
import { newAccessToken } from "../services/spotify.service.js";
export const tokenExpiration = (req, res) => {
  try {
    const spotifyExpiresIn = req.session.expiresIn;
    const youtubeExpiresIn = req.session.youtube_expiresIn;

    const spotifyTokenReceived = req.session.tokenReceivedAt;
    const youtubeTokenReceived = req.session.youtube_tokenReceivedAt;
    if (!spotifyTokenReceived && !youtubeTokenReceived) {
      return res
        .status(200)
        .json({ isSpotifyToken: false, isYoutubeToken: false });
    }
    const spotifyExpiryTime = (spotifyTokenReceived + spotifyExpiresIn) * 1000;
    const youtubeExpiryTime = (youtubeTokenReceived + youtubeExpiresIn) * 1000;
    const isSpotifyToken = Date.now() < spotifyExpiryTime;
    const isYoutubeToken = Date.now() < youtubeExpiryTime;
    // True = not expired and false = expired

    res.status(200).json({ isSpotifyToken, isYoutubeToken });
  } catch (err) {
    console.error("Error in token expiration : ", err.message);
    res.status(500).json("Failed to check token expiration");
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
    console.log("Token", req.session.accessToken);

    res.status(200).json({ message: "Tokens deleted successfully" });
  } catch (error) {
    console.error("Error deleting tokens:", error.message);
    res.status(500).json({ error: "Failed to delete tokens" });
  }
};
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.session.youtube_refreshToken;
    if (!req.session.youtube_refreshToken) {
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
