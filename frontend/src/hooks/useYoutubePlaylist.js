import { useState } from "react";

const useYoutubePlaylist = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [playlistId, setPlaylistId] = useState(null); // State to store playlistId
  const [playlistInfo, setPlaylistInfo] = useState(null);

  const getNewYoutubePlaylist = async ({ title, description }) => {
    setLoading(true);
    try {
      if (!title || !description) {
        throw new Error("Title or description is required");
      }
      const res = await fetch("/api/youtube/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error);
      }

      setPlaylistId(data.playlistId);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error creating playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExistingPlaylist = async ({ playlistName }) => {
    setLoading(true);
    try {
      if (!playlistName) {
        throw new Error("Playlist name is required");
      }
      const res = await fetch("/api/youtube/getPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistName: playlistName }),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error);
      }
      setPlaylistInfo(data.playlist);
      setPlaylistId(data.playlistId);
      console.log(data.playlistId);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error creating playlist:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    playlistId,
    getNewYoutubePlaylist,
    getExistingPlaylist,
    error,
    playlistInfo,
  };
};

export default useYoutubePlaylist;
