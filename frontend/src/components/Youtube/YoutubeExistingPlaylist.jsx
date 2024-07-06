import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useYoutubePlaylist from "../../hooks/useYoutubePlaylist";

const YoutubeExistingPlaylist = () => {
  const navigate = useNavigate();

  const [playlistName, setPlaylistName] = useState("");
  const [goBack, setGoBack] = useState(false);

  const { loading, error, playlistInfo, getExistingPlaylist, playlistId } =
    useYoutubePlaylist();

  const handleBackButtonClick = () => {
    setGoBack(true);
    setPlaylistName("");
  };

  const handleConfirmButtonClick = () => {
    navigate("/spotify-playlist", { state: { playlistId: playlistId } });
  };

  const handleButtonClick = async () => {
    try {
      await getExistingPlaylist({ playlistName });
    } catch (error) {
      toast.error(error.message);
      setGoBack(true);
    }
    // Reset states
    setPlaylistName("");
    setGoBack(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px) saturate(150%)",
        borderRadius: "12px",
        boxShadow: "0px 8px 32px rgba(31, 38, 135, 0.37)",
        p: 4,
        maxWidth: 400,
        margin: "auto",
        marginTop: "50px",
        // Responsive styles
        "@media (max-width: 600px)": {
          marginTop: "20px",
          boxShadow: "none",
          backgroundColor: "transparent",
        },
      }}
    >
      {loading ? (
        // Show loading spinner when loading is true
        <Box style={{ textAlign: "center", color: "white" }}>
          <CircularProgress color="inherit" />
          <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
            Finding Playlist...
          </Typography>
        </Box>
      ) : goBack || !playlistInfo ? (
        // Handle error or no playlist found
        <>
          <Typography variant="h5" gutterBottom style={{ color: "white" }}>
            Enter the name of a Playlist in Your Library
          </Typography>
          <TextField
            label="Playlist Name*"
            variant="outlined"
            fullWidth
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            InputLabelProps={{
              style: { color: "white" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", alignItems: "center" }}
            disabled={loading}
            onClick={handleButtonClick}
            sx={{
              // Responsive styles
              width: "100%",
              "@media (max-width: 600px)": {
                marginTop: "10px",
              },
            }}
          >
            Find a Playlist
          </Button>
        </>
      ) : (
        // Display playlist information when playlistInfo is available and goBack is false
        <>
          <Typography variant="h5" gutterBottom style={{ color: "white" }}>
            Playlist Information:
          </Typography>
          <img
            src={playlistInfo[0].snippet.thumbnails.default.url}
            alt={playlistInfo[0].snippet.title}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <Typography variant="body1" style={{ color: "white" }}>
            Playlist Name: {playlistInfo[0].snippet.title}
          </Typography>
          <Typography variant="body1" style={{ color: "white" }}>
            Description: {playlistInfo[0].snippet.description}
          </Typography>
          <Typography variant="body1" style={{ color: "white" }}>
            Number of Tracks: {playlistInfo[0].contentDetails.itemCount}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", alignItems: "center" }}
            disabled={loading}
            onClick={handleBackButtonClick}
            sx={{
              // Responsive styles
              width: "100%",
              "@media (max-width: 600px)": {
                marginTop: "10px",
              },
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px", alignItems: "center" }}
            disabled={loading}
            onClick={handleConfirmButtonClick}
            sx={{
              // Responsive styles
              width: "100%",
              "@media (max-width: 600px)": {
                marginTop: "10px",
              },
            }}
          >
            Confirm Playlist
          </Button>
        </>
      )}
    </Box>
  );
};

export default YoutubeExistingPlaylist;
