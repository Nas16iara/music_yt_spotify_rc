//Make external API requests to spotify:

export const getAccessToken = async (code) => {
  try {
    const params = new URLSearchParams();
    const redirectUrl = process.env.SPOTIFY_REDIRECT_URL;
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUrl);
    params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET);
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    console.log(data.expires_in);
    if (data.error) {
      throw new Error(data.message);
    }
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (err) {
    console.error("Error in getAccessToken:", err.message);
    throw err;
  }
};

export const getUserPlaylists = async (accessToken) => {
  try {
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.items;
  } catch (err) {
    console.error("Error in getUserPlaylists:", err.message);
    th;
  }
};

export const getUserData = async (accessToken) => {
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (err) {
    console.error("Error in getUserData:", err.message);
    throw err;
  }
};

export const getSavedTracks = async (accessToken, playlistId) => {
  try {
    let offset = 0;
    let allTracksIDs = [];
    const limit = 50;

    while (true) {
      const songRes = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const tracks = await songRes.json();

      if (tracks.error) {
        throw new error(tracks.error.message);
      }

      if (tracks.items.length === 0) {
        break;
      }

      allTracksIDs = allTracksIDs.concat(
        tracks.items.map((item) => item.track.id)
      );

      offset += limit;
    }
    return allTracksIDs;
  } catch (err) {
    console.error("Error in getSavedTracks:", err.message);
    throw new Error("Failed to fetch saved tracks or add to playlist");
  }
};

export const createPlaylist = async (accessToken, userId, playlistName) => {
  try {
    console.log("INFO: ", userId, playlistName);
    const res = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: playlistName, public: false }),
      }
    );
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.id;
  } catch (err) {
    console.error("Error in createPlaylists:", err.message);
    throw err.message;
  }
};

export const addTracksToPlaylist = async (
  accessToken,
  playlistId,
  trackIds
) => {
  try {
    const maxBatchSize = 100; // Maximum number of track URIs per request
    const batches = [];
    // console.log(trackIds);
    for (let i = 0; i < trackIds.length; i += maxBatchSize) {
      const batch = trackIds.slice(i, i + maxBatchSize);
      batches.push(batch);
    }

    const results = [];
    for (const batch of batches) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            uris: batch.map((trackId) => `spotify:track:${trackId}`),
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      results.push(data);
    }
    return results;
  } catch (err) {
    console.error("Error in addTracksToPlaylist:", err.message);
    throw err.message;
  }
};

export const newAccessToken = async (refreshToken) => {
  try {
    const res = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.message);
    }
    return res
      .status(200)
      .json({ accessToken: data.access_token, expiresIn: data.expires_in });
  } catch (err) {
    console.error("Error in newAccessToken:", err.message);
    throw new Error(err);
  }
};

export const getPlaylistItems = async (accessToken, playlistId) => {
  const limit = 20; // Max limit per request
  let offset = 0;
  let allTracks = [];

  try {
    // Fetch playlist details to get total number of tracks
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlistData = await playlistRes.json();

    console.log(`Playlist: ${playlistData.total}`);

    if (playlistData.error) {
      throw new Error(playlistData.error.message); // Throw an error with Spotify API error message
    }

    const totalItems = playlistData.tracks.total;

    while (offset < totalItems) {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message); // Throw an error with Spotify API error message
      }
      const newItems = data.items.filter(
        (item) => !allTracks.some((track) => track.track.id === item.track.id)
      );

      allTracks = [...allTracks, ...data.items];

      // Update offset for next page
      offset += limit;
    }

    return allTracks;
  } catch (err) {
    console.error("Error fetching playlist items:", err.message);
    throw new Error(err.message);
  }
};
