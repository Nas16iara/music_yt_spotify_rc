import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useState } from "react";
import YoutubeTrackCard from "../components/Youtube/YoutubeTrackCard"; // Assuming this is where you import your modified YoutubeTrackCard component
import { useLocation, useNavigate } from "react-router-dom";

// Function to convert seconds to minutes:seconds format
const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const YoutubeTracks = () => {
  const navigate = useNavigate();
  const tracks = location?.state?.tracks;
  const playlistId = location?.state?.youtubePlaylistId;
  const trackErrors = location?.state?.songErrors;
  const handleNavigateHome = () => {
    navigate("/");
  };
  
  console.log(location?.state?.songErrors);
  if (!tracks || !playlistId || !trackErrors) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "33vh",
          flexGrow: 1,
          marginTop: "20px",
        }}
      >
        <Typography
          variant="h6"
          component="h4"
          gutterBottom
          style={{ color: "white", textAlign: "left", marginLeft: "20px" }}
        >
          No tracks added
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateHome}
        >
          Home
        </Button>
      </Container>
    );
  }

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "33vh",
        flexGrow: 1,
        marginTop: "20px",
      }}
    >
      <Typography
        variant="h6"
        component="h4"
        gutterBottom
        style={{ color: "white", textAlign: "left", marginLeft: "20px" }}
      >
        {" "}
        Songs from Youtube{" "}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {tracks?.length > 0 &&
          tracks.map((track) => (
            <Grid item key={track.id} xs={12} sm={6} md={4} lg={3}>
              <YoutubeTrackCard track={track} />
            </Grid>
          ))}
      </Grid>

      {trackErrors && (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            margin: "20px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Error Adding Track:
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {trackErrors.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Artists:</strong>{" "}
            {trackErrors.artists.map((artist, index) => (
              <span key={index}>
                {artist}
                {index < trackErrors.artists.length - 1 && ", "}
              </span>
            ))}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Duration:</strong> {formatDuration(trackErrors.duration)}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default YoutubeTracks;
