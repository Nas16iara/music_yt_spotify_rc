import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import useSpotifyTracks from "../hooks/useSpotifyTracks";
import useYoutubeTracks from "../hooks/useYoutubeTracks";

import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import SpotifyTrackCard from "../components/Spotify/SpotifyTrackCard";

import toast from "react-hot-toast";

import { Button, Container, Grid, Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const SpotifyTracks = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const youtubePlaylistId = location.state?.youtubePlaylistId;
  console.log("PLAYLIst ID is ", youtubePlaylistId);
  const { playlistId } = useParams();

  const { tracks, loading, getSpotifyTracks, error } = useSpotifyTracks();
  const {
    youtubeLoading,
    getYoutubeSongs,
    youtubeSongs,
    youtubeError,
    youtubeSongsErrors,
  } = useYoutubeTracks();

  const [fetchingTracks, setFetchingTracks] = useState(false);

  const handleYoutubeTransfer = async () => {
    console.log(youtubePlaylistId);
    await getYoutubeSongs(tracks, youtubePlaylistId);
    if (youtubeError) {
      toast.error("Error fetching YouTube songs:", youtubeError.message);
    }
    if (!youtubeLoading && youtubeSongs.length > 0) {
      console.log("Youtube", youtubeSongs);
      console.log("Youtube Error", youtubeSongsErrors);
      navigate("/youtube-tracks", {
        state: {
          tracks: youtubeSongs,
          youtubePlaylistId: youtubePlaylistId,
          songErrors: youtubeSongsErrors,
        },
      });
    }
  };

  const navigateToPlaylist = () => {
    navigate("/spotify-playlist");
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

    if (!youtubeLoading && youtubeSongs.length > 0) {
      console.log("Youtube", youtubeSongs);
      console.log("Youtube Error", youtubeSongsErrors);
      navigate("/youtube-tracks", {
        state: {
          tracks: youtubeSongs,
          youtubePlaylistId: youtubePlaylistId,
          songErrors: youtubeSongsErrors,
        },
      });
    }
  }, [
    playlistId,
    getSpotifyTracks,
    tracks,
    fetchingTracks,
    setFetchingTracks,
    youtubeSongs,
    youtubeSongsErrors,
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
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "33vh",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h7"
          component="h4"
          gutterBottom
          style={{
            color: "white",
            fontSize: "20pt",
            textAlign: "center",
            padding: "3px",
          }}
        >
          SpotifyTracks
        </Typography>
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Button
            disabled={youtubeLoading}
            onClick={handleYoutubeTransfer}
            style={{
              color: "white",
              backgroundColor: "green",
              fontSize: "10pt",
              textAlign: "center",
              borderRadius: "12px",
              padding: "10px",
              marginTop: "20px",
              transition: "background-color 0.3s ease", // Smooth transition for hover effect
              display: "flex",
              alignItems: "center",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "darkred", // Change background color on hover
              },
            }}
            startIcon={<YouTubeIcon />} // Place YouTube icon before the text
          >
            Transfer to Youtube
          </Button>
        </Container>
      </Container>
      <Container>
        <Typography
          variant="h7"
          component="h4"
          gutterBottom
          style={{ color: "white", textAlign: "left", marginLeft: "20px" }}
        >
          {" "}
          Songs in Playlist{" "}
        </Typography>
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
