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
      //TODO: fix the check after logging the sets are janky
      try {
        const tokenExpired = await fetch("/api/tokens/checkTokenExpiration", {
          method: "GET",
          credentials: "include", // Include cookies
        });
        const data = await tokenExpired.json();
        console.log(data);
        if (data.error) throw new Error(data.error);
        console.log("SPO", data.isSpotifyToken);
        console.log("YT", data.isYoutubeToken);
        if (data.isSpotifyToken) {
          setSpotifyAuthenticated(true);
          toast.success('Spotify successfully signed in');
        }
        if (data.isYoutubeToken) {
          setYoutubeAuthenticated(true);
          toast.success('YouTube Music successfully signed in');
        }

        if (spotifyAuthenticated && youtubeAuthenticated) {
          setNextStepEnabled(true);
          toast.success("You can now proceed to the next step");
        }

        console.log(
          nextStepEnabled,
          " ",
          spotifyAuthenticated,
          " ",
          youtubeAuthenticated
        );
        console.log(youtubeAuthenticated, " ", spotifyAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Error checking authentication status");
      }
    };

    checkAuthentication();
  }, [
    nextStepEnabled,
    setNextStepEnabled,
    spotifyAuthenticated,
    youtubeAuthenticated,
  ]);
  const resetButton = async () => {
    try {
      const response = await fetch("/api/tokens/tokenLogout", {
        method: "GET",
        credentials: "include", // Include cookies
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      toast.success("Cookies deleted");
      window.location.reload();
    } catch (error) {
      console.error("Error resetting tokens:", error);
      toast.error("Error resetting tokens");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
        onClick={resetButton}
      >
        Reset
      </Button>
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
    </>
  );
};

export default SpotifyYoutube;
