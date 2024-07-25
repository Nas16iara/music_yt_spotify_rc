/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Grid } from "@mui/material";

function convertMillisecondsToTimeString(milliseconds) {
  // Convert milliseconds to seconds
  let totalSeconds = milliseconds / 1000;

  // Calculate minutes
  let minutes = Math.floor(totalSeconds / 60);

  // Calculate remaining seconds
  let seconds = Math.floor(totalSeconds % 60);

  // Format the time string with minutes and seconds
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return timeString;
}

const YoutubeErrorTrackCard = ({ song }) => {
  const parts = song.trackString
    .split('"')
    .map((part) => part.trim())
    .filter((part) => part !== "");

  // parts[0] will be the song title, parts[1] will be the artist
  const songTitle = parts[0];
  const artist = parts[1];

  return (
    <Card
      style={{
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparent white background
        backdropFilter: "blur(10px)", // Blur effect for glassmorphism
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow
        borderRadius: "10px", // Rounded corners
        border: "1px solid rgba(255, 255, 255, 0.18)", // Semi-transparent border
        color: "white", // Text color
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          style={{ marginBottom: "10px" }}
        >
          Title: {songTitle}
        </Typography>
        <Grid container spacing={1} style={{ marginBottom: "5px" }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">
              Artist: {artist}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Duration: {convertMillisecondsToTimeString(song.duration)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">
              Album: {song.album}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default YoutubeErrorTrackCard;
