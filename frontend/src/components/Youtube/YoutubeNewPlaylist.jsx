import { TextField, Button, Box } from "@mui/material";
import useYoutubePlaylist from "../../hooks/useYoutubePlaylist.js"; // Adjust the path as per your project structure
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const YoutubeNewPlaylist = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { loading, playlistId, getNewYoutubePlaylist, error } =
    useYoutubePlaylist();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await getNewYoutubePlaylist({ title, description });
    if (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (playlistId) {
      toast.success("New YouTube playlist created successfully!");
      console.log(playlistId);
      navigate("/spotify-playlist", { state: { playlistId: playlistId } });
      handleReset();
    }
  }, [playlistId]);
  const handleReset = () => {
    setTitle("");
    setDescription("");
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
      <div style={{ color: "white", textAlign: "center" }}>
        <h1>Enter new Playlist information</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <TextField
          id="title"
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", width: "100%" }}
          disabled={loading}
          sx={{
            // Responsive styles
            "@media (max-width: 600px)": {
              marginTop: "10px",
            },
          }}
        >
          {loading ? "Creating..." : "Create a Playlist"}
        </Button>
      </form>
    </Box>
  );
};

export default YoutubeNewPlaylist;
