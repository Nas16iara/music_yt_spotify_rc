import { Grid, Typography, Container, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const handleGetStartedButton = () => {
    // Navigate to '/spotify' route
    navigate("/spotify");
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} justifyContent="center">
        <Grid
          item
          xs={12}
          sx={{
            mt: "30px",
            color: "white",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Transfer Your Spotify Playlist to YouTube
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Follow these simple steps to transfer your favorite Spotify playlist
            to YouTube:
          </Typography>
        </Grid>
      
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
              backdropFilter: "blur(10px)", // Blur effect for glassmorphism
              borderRadius: 10, // Rounded corners
              minHeight: "60vh", // Adjust height as needed
            }}
          >
            <Typography variant="h5" gutterBottom>
              Steps to Transfer:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 1: Log In</strong>
              <br />
              Log in to your Spotify and YouTube Music accounts to authorize
              access.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 2: Select Playlist</strong>
              <br />
              Choose the Spotify playlist you want to transfer.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 3: Initiate Transfer</strong>
              <br />
              Click &aposTransfer&apos to start converting your Spotify playlist
              to a YouTube playlist.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 4: Completion</strong>
              <br />
              Once the transfer is complete, you&aposll receive a confirmation
              message.
            </Typography>
            <Typography variant="body1">
              Enjoy your music on YouTube Music!
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetStartedButton}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GetStarted;
