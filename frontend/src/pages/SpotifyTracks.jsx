import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useSpotifyTracks from "../hooks/useSpotifyTracks"; // Assuming this is your custom hook for fetching tracks
import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import SpotifyTrackCard from "../components/Spotify/SpotifyTrackCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Container, Grid } from "@mui/material";
const SpotifyTracks = () => {
  const { playlistId } = useParams(); // Get the playlistId from URL params
  const { tracks, loading, getSpotifyTracks, error } = useSpotifyTracks();
  const [fetchingTracks, setFetchingTracks] = useState(false); // Flag to control fetching
  const navigate = useNavigate(); // Use navigate hook to navigate to other routes
  const navigateToPlaylist = () => {
    navigate("/spotify");
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setFetchingTracks(true); // Set fetching state to true
        await getSpotifyTracks(playlistId); // Fetch tracks for the specified playlistId
        setFetchingTracks(false); // Set fetching state back to false after fetching
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
        setFetchingTracks(false); // Ensure to set fetching state back to false on error
      }
    };

    if (playlistId && tracks?.length === 0 && !fetchingTracks && !error) {
      fetchTracks(); // Only fetch tracks when playlistId changes or tracks are empty and not already fetching
      console.log(tracks);
    }
    if (error) {
      toast.error(error);

      console.log(error);
    }
  }, [
    playlistId,
    getSpotifyTracks,
    tracks,
    fetchingTracks,
    setFetchingTracks,
    error,
  ]);
  if (error) {
    return (
      <>
        <div
          style={{
            color: "white",
            fontSize: "20pt",
            textAlign: "center",
            padding: "10px",
          }}
        >
          SpotifyTracks
        </div>
        <div style={{ color: "white", fontSize: "20pt", textAlign: "center" }}>
          {error === "No tracks found in playlist"
            ? "No tracks available in this playlist."
            : "Failed to fetch tracks. Please try again."}
        </div>
        <Button
          variant="contained"
          onClick={navigateToPlaylist}
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          Go to Home
        </Button>
      </>
    );
  }
  return (
    <>
      <div
        style={{
          color: "white",
          fontSize: "20pt",
          textAlign: "center",
          padding: "10px",
        }}
      >
        SpotifyTracks
      </div>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            tracks?.length > 0 &&
            tracks.map((track) => (
              <Grid item key={track.id} xs={12} sm={6} md={4} lg={3}>
                <SpotifyTrackCard track={track} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
};

export default SpotifyTracks;
