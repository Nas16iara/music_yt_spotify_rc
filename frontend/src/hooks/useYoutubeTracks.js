import { useState } from "react";
const useYoutubeTracks = () => {
  const [youtubeSongs, setYoutubeSongs] = useState([]);
  const [youtubeSongsErrors, setYoutubeSongsErrors] = useState([]);

  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState(null);

  const getYoutubeSongs = async (tracks, youtubePlaylistId) => {
    setYoutubeLoading(true);
    console.log("IN HOOK BEFORE EXTRACT ", tracks);
    const songs = extractTrackData(tracks);
    console.log("IN HOOK AFTER EXTRACT ", songs);
    console.log("Playlist Id: " + youtubePlaylistId);
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
      setYoutubeSongs(data.songs);
      setYoutubeSongsErrors(data.errorList);
      setYoutubeError(null);
      console.log(youtubeSongs);
    } catch (err) {
      setYoutubeError(err.message);
    } finally {
      setYoutubeLoading(false);
    }
  };
  return {
    youtubeLoading,
    getYoutubeSongs,
    youtubeSongs,
    youtubeSongsErrors,
    youtubeError,
  };
};

export default useYoutubeTracks;

const extractTrackData = (tracks) => {
  return tracks.map((track) => ({
    name: track.name,
    duration: track.duration,
    artists: track.artists.map((artist) => artist.name),
  }));
};
