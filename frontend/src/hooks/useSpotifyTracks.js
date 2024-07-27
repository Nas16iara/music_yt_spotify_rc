import { useState } from "react";
const useSpotifyTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSpotifyTracks = async (playlistId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/spotify/tracks/${playlistId}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      setTracks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, getSpotifyTracks, tracks, error };
};

export default useSpotifyTracks;
