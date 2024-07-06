import { Box, Grid, Typography } from "@mui/material";
import YoutubeNewPlaylist from "../components/Youtube/YoutubeNewPlaylist";
import YoutubeExistingPlaylist from "../components/Youtube/YoutubeExistingPlaylist";

const YoutubePlaylist = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px) saturate(150%)",
        borderRadius: "12px",
        boxShadow: "0px 8px 32px rgba(31, 38, 135, 0.37)",
        p: 4,
        maxWidth: 800,
        margin: "auto",
        marginTop: "30px",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ color: "white", mb: 4 }}>
        Add tracks to an existing playlist or new playlist
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <YoutubeExistingPlaylist />
        </Grid>
        <Grid item xs={12} md={6}>
          <YoutubeNewPlaylist />
        </Grid>
      </Grid>
    </Box>
  );
};

export default YoutubePlaylist;
