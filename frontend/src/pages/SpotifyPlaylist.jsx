import { useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";
import SpotifyPlaylistCard from "../components/Spotify/SpotifyPlaylistCard"; // Adjust path as needed
import useSpotifyPlaylist from "../hooks/useSpotifyPlaylist";
import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const SpotifyPlaylist = () => {
  const location = useLocation();
  const youtubePlaylistId = location.state?.playlistId;
  console.log("pLAYLIST ID 1", youtubePlaylistId);

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
    navigate("/transfer");
  }
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
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
        <a
          href="/api/spotify/liked-songs"
          style={{
            display: "flex",
            textDecoration: "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Get Liked Songs
          </Button>
        </a>{" "}
        <p
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Note that button will fetch songs from liked songs{" "}
        </p>
      </div>
      <hr style={{ width: "80%", margin: "20px auto" }} />
      {fetching && loading ? (
        <LoadingSkeleton />
      ) : (
        <Grid container spacing={3} padding={2} >
          <>
            {playlist?.playlists?.map((playlistItem) => (
              <SpotifyPlaylistCard
                key={playlistItem.id}
                playlistItems={playlistItem}
                youtubePlaylistId={youtubePlaylistId}
              />
            ))}
          </>
        </Grid>
      )}
    </div>
  );
};

export default SpotifyPlaylist;
