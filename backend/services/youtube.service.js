// youtube.service.js file
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { configureEnvironment } from "../config.js";

const config = configureEnvironment();
const client_Id = config.YOUTUBE_CLIENT_ID;
const client_Secret = config.YOUTUBE_CLIENT_SECRET;
const redirect_Uri = config.YOUTUBE_REDIRECT_URL;

const oAuth2Client = new OAuth2Client({
  clientId: client_Id,
  clientSecret: client_Secret,
  redirectUri: redirect_Uri,
});

export const generateAuthUrl = async () => {
  try {
    const scopes = ["https://www.googleapis.com/auth/youtube"];
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    console.log("Authorization URL:", url);
    return url;
  } catch (err) {
    console.error("Failed to generate auth URL:", err.message);
    throw new Error("Failed to generate auth URL");
  }
};

export const getAccessToken = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
  } catch (err) {
    console.error("Failed to get access token:", err.message);
    throw new Error("Failed to get access token");
  }
};

export const newYoutubeAccessToken = async (refreshToken) => {
  try {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const { tokens } = await oAuth2Client.refreshAccessToken();
    const { access_token, expiry_date } = tokens;

    return { access_token, expiry_date };
  } catch (err) {
    console.error("Failed to refresh token:", err.message);
    throw new Error("Failed to refresh token");
  }
};

export const createPlaylists = async (accessToken, playlistData) => {
  try {
    const { title, description } = playlistData;
    if (!accessToken) {
      console.error("Access token is missing");
      throw new Error("Access token is missing");
    }

    oAuth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oAuth2Client,
    });

    const res = await youtube.playlists.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title,
          description: description,
        },
        status: {
          privacyStatus: "private",
        },
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Failed to create playlist in services:", err.message);
    throw new Error("Failed to create playlist");
  }
};

export const getExistingPlaylists = async (accessToken, playlistName) => {
  try {
    oAuth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    let playlists = [];
    let nextPageToken = null;
    let matchFound = false;
    do {
      const res = await youtube.playlists.list({
        part: "snippet, contentDetails",
        maxResults: 50,
        mine: true,
        pageToken: nextPageToken,
      });

      playlists = playlists.concat(res.data.items);
      console.log(playlists);
      const matchedPlaylist = playlists.find((playlist) =>
        playlist.snippet.title
          .toLowerCase()
          .includes(playlistName.toLowerCase())
      );
      console.log('MATCHED PLAYLIST',  matchedPlaylist);
      if (matchedPlaylist) {
        matchFound = true;
        playlists = [matchedPlaylist]; // Keep only the matched playlist
        console.log('IN LOOP: ', playlists);
      }

      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken && !matchFound);

    if (!matchFound) {
      throw new Error(`No existing playlist found with name '${playlistName}'`);
    }

    const playlistId = playlists[0].id;
    console.log('LAST BIG  COMMENT ', playlists)
    console.log("Playlist ID:", playlistId);

    return { playlist: playlists, playlistId: playlistId };
  } catch (error) {
    console.error("Error fetching playlists:", error.message);
    throw new Error("Failed to fetch playlists");
  }
};

export const addTracksToPlaylist = async (
  accessToken,
  youtubePlaylistId,
  trackId
) => {
  try {
    oAuth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    const res = await youtube.playlistItems.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          playlistId: youtubePlaylistId,
          resourceId: {
            kind: "youtube#video",
            videoId: trackId,
          },
        },
      },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to add tracks to playlist:", err.message);
    throw new Error("Failed to add tracks to playlist");
  }
};

export const searchYoutube = async (accessToken, query, duration) => {
  try {
    oAuth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    const res = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1,
      videoCategoryId: "10",
    });

    if (!res.data.items || res.data.items.length === 0) {
      throw new Error(`No results found for query '${query}'`);
    }

    const video = res.data.items[0];
    const videoId = video.id.videoId;

    const videoDetailsResponse = await youtube.videos.list({
      part: "contentDetails",
      id: videoId,
    });

    if (videoDetailsResponse.data.items.length === 0) {
      throw new Error(`No video details found for videoId '${videoId}'`);
    }

    const videoDetails = videoDetailsResponse.data.items[0];
    const videoDuration = parseISO8601Duration(
      videoDetails.contentDetails.duration
    );
    const durationMatch = Math.abs(videoDuration - duration) <= 30000;

    return {
      title: video.snippet.title,
      trackId: videoId,
      thumbnail: video.snippet.thumbnails.default.url,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      success: durationMatch, // Indicates whether the duration is within ±30 seconds
    };
  } catch (error) {
    console.error("Error searching YouTube:", error.message);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
};

function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  let hours = parseInt(match[1]) || 0;
  let minutes = parseInt(match[2]) || 0;
  let seconds = parseInt(match[3]) || 0;

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}
