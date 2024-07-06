//Make external API requests to spotify:

export const getAccessToken = async (code) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URL);
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
    res.status(500).json({ error: "Internal Server Error" });
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
      throw new Error(data.message);
    }
    return data.items;
  } catch (err) {
    console.error("Error in getUserPlaylists:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
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
      throw new Error(data.message);
    }
    return data;
  } catch (err) {
    console.error("Error in getUserData:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSavedTracks = async (accessToken) => {
  try {
    const res = await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch saved tracks: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (err) {
    console.error("Error in getSavedTracks:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPlaylist = async (accessToken, userId, playlistName) => {
  try {
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPlaylistItems = async (accessToken, playlistId) => {
  const limit = 100; // Max limit per request

  let offset = 0;
  let allTracks = [];

  try {
    while (true) {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      allTracks = [...allTracks, ...data.items];

      if (!data.next) {
        // If there's no 'next' URL, we've fetched all tracks
        break;
      }

      // Update offset for next page
      const url = new URL(data.next);
      offset = Number(url.searchParams.get("offset"));
    }

    return allTracks;
  } catch (err) {
    console.error("Error in getPlaylistItems:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
