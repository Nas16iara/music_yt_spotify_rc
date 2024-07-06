import { Grid, Typography, Button } from "@mui/material";
import SpotifyLogo from "../assets/spotify-logo.png"; // Replace with your Spotify logo path
import YoutubeMusicIcon from "../assets/youtube-music-logo.png"; // Replace with your YouTube Music logo path
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SpotifyYoutube = () => {
  const navigate = useNavigate();

  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [youtubeAuthenticated, setYoutubeAuthenticated] = useState(false);
  const [nextStepEnabled, setNextStepEnabled] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const tokenExpired = await fetch("/api/tokens/checkTokenExpiration", {
          method: "GET",
          credentials: "include", // Include cookies
        });
        const data = await tokenExpired.json();
        if (data.isSpotifyToken) {
          setSpotifyAuthenticated(true);
        }
        if (data.isYoutubeToken) {
          setYoutubeAuthenticated(true);
        }
        if (data.error) throw new Error(data.error);

        if (spotifyAuthenticated && youtubeAuthenticated) {
          setNextStepEnabled(true);
        }
        console.log(nextStepEnabled, ' ', spotifyAuthenticated, ' ', youtubeAuthenticated)
        console.log(youtubeAuthenticated, ' ', spotifyAuthenticated)
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Error checking authentication status");
      }
    };

    checkAuthentication();
  }, [nextStepEnabled]);

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Grid item>
        <Typography variant="h4" align="center" color="white" gutterBottom>
          Log in to Spotify and YouTube to Fetch and Transfer playlist data
        </Typography>
      </Grid>
      <Grid
        container
        item
        spacing={3}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Grid item>
          <img src={SpotifyLogo} alt="Spotify Logo" style={{ height: 200 }} />
          <Grid>
            <a href="/api/spotify/login" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                disabled={spotifyAuthenticated}
              >
                Log in with Spotify
              </Button>
            </a>
          </Grid>
        </Grid>
        <Grid item>
          <img
            src={YoutubeMusicIcon}
            alt="Youtube Music"
            style={{ height: 200 }}
          />
          <Grid>
            <a href="/api/youtube/login" style={{ textDecoration: "none" }}>
              <Button
                disabled={youtubeAuthenticated}
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Log in with Youtube
              </Button>
            </a>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={!nextStepEnabled}
          onClick={() => {
            setSpotifyAuthenticated(false);
            setYoutubeAuthenticated(false);
            navigate("/youtube-playlist");
          }}
        >
          Next Step
        </Button>
      </Grid>
    </Grid>
  );
};

export default SpotifyYoutube;
