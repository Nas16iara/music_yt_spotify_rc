import { useState } from "react";
import toast from "react-hot-toast";
const useYoutubeTracks = () => {
  const [addedSongs, setAddedSongs] = useState([]);
  const [unAddedSongs, setUnAddedSongs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getYoutubeSongs = async (tracks, youtubePlaylistId) => {
    setLoading(true);
    if (!tracks || !youtubePlaylistId) {
      setUnAddedSongs(tracks);
      console.error(tracks);
      setError("Missing required parameters");
    }
    const songs = tracks;

    try {
      const response = await fetch(`/api/youtube/addTracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songs, youtubePlaylistId }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.addedSongs) {
        setAddedSongs(data.addedSongs);
      }
      if (data.unAddedSongs) {
        setUnAddedSongs(data.unAddedSongs);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('1: ', err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    getYoutubeSongs,
    addedSongs,
    unAddedSongs,
    error,
  };
};

export default useYoutubeTracks;
