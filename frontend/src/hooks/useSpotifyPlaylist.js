import { useState } from "react";
const useSpotifyPlaylist = () => {
  const [playlist, setPlaylist] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSpotifyPlaylist = async () => {
    setLoading(true);
    try {
      console.log("Spotify Playlist Loading");
      const res = await fetch("/api/spotify/playlists");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setPlaylist(data);
      console.log(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getSpotifyPlaylist, playlist, error };
};

export default useSpotifyPlaylist;
