// youtube.service.js file
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { configureEnvironment } from "../config.js";

const config = configureEnvironment();
const client_Id = config.YOUTUBE_CLIENT_ID;
const client_Secret = config.YOUTUBE_CLIENT_SECRET;
const redirect_Uri =
  process?.env?.NODE_ENV === "development"
    ? "http://localhost:3000/api/youtube/callback"
    : config.YOUTUBE_REDIRECT_URL;

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
    const { tokens } = await oAuth2Client.getToken({
      code,
      scope: "offline_access",
    });
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
      console.log("MATCHED PLAYLIST", matchedPlaylist);
      if (matchedPlaylist) {
        matchFound = true;
        playlists = [matchedPlaylist]; // Keep only the matched playlist
        console.log("IN LOOP: ", playlists);
      }

      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken && !matchFound);

    if (!matchFound) {
      throw new Error(`No existing playlist found with name '${playlistName}'`);
    }

    const playlistId = playlists[0].id;
    console.log("LAST BIG  COMMENT ", playlists);
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

export const searchYoutube = async (
  accessToken,
  trackString,
  album,
  duration
) => {
  try {
    // Set up YouTube API client
    oAuth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

    // Search for videos based on track title and album
    const res = await youtube.search.list({
      part: "snippet",
      q: `${trackString} `, // Include album in search query
      type: "video",
      maxResults: 5, // Fetching multiple results to find the best match
      videoCategoryId: "10", // Music category
    });

    if (!res.data.items || res.data.items.length === 0) {
      throw new Error(`No results found for query '${trackString} ${album}'`);
    }

    // Iterate through search results to find the best match
    let bestMatch = null;
    let bestMatchScore = Number.MAX_SAFE_INTEGER; // Lower is better

    const SOME_THRESHOLD = 50000;

    for (const video of res.data.items) {
      const videoId = video.id.videoId;

      // Fetch video details to get duration
      const videoDetailsResponse = await youtube.videos.list({
        part: "contentDetails",
        id: videoId,
      });

      if (videoDetailsResponse.data.items.length === 0) {
        console.warn(`No video details found for videoId '${videoId}'`);
        continue;
      }

      const videoDetails = videoDetailsResponse.data.items[0];
      const videoDuration = parseISO8601Duration(
        videoDetails.contentDetails.duration
      );

      // Calculate duration difference (allowing 30 seconds difference)
      const durationDifference = Math.abs(videoDuration - duration);
      const durationMatch = durationDifference <= 30000;

      // Calculate title similarity
      const title = video.snippet.title;
      const titleScore = calculateTitleScore(trackString, title);

      // Calculate overall score
      const score = durationMatch
        ? durationDifference + titleScore
        : Number.MAX_SAFE_INTEGER;

      // Update best match if this video has a better score
      if (score < bestMatchScore) {
        bestMatch = {
          title: title,
          trackId: videoId,
          thumbnail: video.snippet.thumbnails.default.url,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          videoDuration: videoDuration,
        };
        bestMatchScore = score;
      }

      // Early exit if a good enough match is found
      if (bestMatchScore < SOME_THRESHOLD) {
        break;
      }
    }

    if (!bestMatch) {
      throw new Error(`No suitable match found for track '${trackString}'`);
    }

    return bestMatch;
  } catch (error) {
    console.error("Error searching YouTube:", error.message);
    throw error;
  }
};

function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

function calculateTitleScore(trackString, videoTitle) {
  if (!trackString || !videoTitle) {
    return 0; // Default score for empty values
  }

  const trackStringLower = trackString.toLowerCase();
  const videoTitleLower = videoTitle.toLowerCase();

  // Use a scoring mechanism to determine similarity
  // Example: Levenshtein distance or similar metric
  const dp = Array(trackStringLower.length + 1)
    .fill(null)
    .map(() => Array(videoTitleLower.length + 1).fill(null));

  for (let i = 0; i <= trackStringLower.length; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= videoTitleLower.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= trackStringLower.length; i++) {
    for (let j = 1; j <= videoTitleLower.length; j++) {
      const cost = trackStringLower[i - 1] === videoTitleLower[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Deletion
        dp[i][j - 1] + 1, // Insertion
        dp[i - 1][j - 1] + cost // Substitution or no change
      );
    }
  }

  const maxLen = Math.max(trackStringLower.length, videoTitleLower.length);
  const similarity =
    1 - dp[trackStringLower.length][videoTitleLower.length] / maxLen;

  return similarity;
}
