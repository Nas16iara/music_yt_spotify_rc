import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import SpotifyPlaylistCard from "../components/Spotify/SpotifyPlaylistCard"; // Adjust path as needed
import useSpotifyPlaylist from "../hooks/useSpotifyPlaylist";
import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const SpotifyPlaylist = () => {
  const navigate = useNavigate();
  const { loading, getSpotifyPlaylist, playlist, error } = useSpotifyPlaylist();
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    const fetchPlaylist = async () => {
      await getSpotifyPlaylist();
      setFetching(false);
    };
    if (Object.keys(playlist).length <= 0 && !fetching) {
      setFetching(true);
      fetchPlaylist();
    } else if (!fetching && Object.keys(playlist).length > 0) {
      setFetching(false);
    }
  }, [getSpotifyPlaylist, playlist, fetching, setFetching]);

  if (error) {
    toast.error(error);
    navigate("/spotify");
  }
  return (
    <>
      <div>
        <h2
          style={{
            marginTop: "20",
            marginLeft: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          Select A Playlist to Transfer
        </h2>
        {fetching && loading ? (
          <LoadingSkeleton />
        ) : (
          <Grid container spacing={3} padding={2}>
            {playlist?.playlists?.map((playlistItem) => (
              <SpotifyPlaylistCard
                key={playlistItem.id}
                playlistItems={playlistItem}
              />
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default SpotifyPlaylist;
