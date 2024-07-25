/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SpotifyPlaylistCard = ({ playlistItems, youtubePlaylistId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to backend endpoint when card is clicked
    if (playlistItems && playlistItems.id) {
      console.log(playlistItems.id);
      console.log("pLAYLIST ID ", youtubePlaylistId);
      navigate(`/spotify-tracks/${playlistItems.id}`, {
        state: { youtubePlaylistId: youtubePlaylistId },
      });
    } else {
      toast.error("Invalid playlist item:", playlistItems);
      // Optionally handle the case where playlistItems.id is missing
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px) brightness(80%)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: 140,
            objectFit: "cover",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
          image={playlistItems.images?.[0]?.url || "placeholder_image_url"}
          alt="Playlist Image"
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{ fontSize: "1rem" }}
          >
            {playlistItems?.name || "Untitled Playlist"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            {playlistItems?.description
              ? playlistItems.description
              : "No description available"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            Total Tracks: {playlistItems?.tracks?.total || 0}
          </Typography>
          <Button
            onClick={handleCardClick}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2, position: "relative" }}
          >
            View Playlist
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SpotifyPlaylistCard;
