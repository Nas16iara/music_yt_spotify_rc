import { Grid, Typography, Button } from "@mui/material";
import SpotifyLogo from "../assets/spotify-logo.png"; // Replace with your Spotify logo path

const Spotify = () => {
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <div className="music-note note-1"></div>
      <div className="music-note note-2"></div>
      <div className="music-note note-3"></div>

      <Grid item>
        <Typography variant="h4" align="center" color="white" gutterBottom>
          Log in to Spotify to fetch playlist data
        </Typography>
      </Grid>
      <Grid item>
        <img src={SpotifyLogo} alt="Spotify Logo" style={{ height: 200 }} />
      </Grid>
      <Grid item>
        <a href="/api/spotify/login">
          <Button variant="contained" color="primary">
            Log in with Spotify
          </Button>
        </a>
      </Grid>
    </Grid>
  );
};

export default Spotify;
