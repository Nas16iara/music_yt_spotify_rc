/* eslint-disable react/prop-types */
import { Card, CardContent, Typography } from "@mui/material";

function millisecondsToTime(milliseconds) {
  // Convert milliseconds to seconds
  let totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate hours, minutes, and remaining seconds
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Format the time components into a string
  let timeString = "";
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes}m `;
  }
  timeString += `${seconds}s`;

  return timeString;
}

const YoutubeTrackCard = ({ track }) => {
  console.log(track);
  const trackCardStyle = {
    maxWidth: 300,
    height: 400,
    margin: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Box shadow
    border: "1px solid rgba(255, 255, 255, 0.18)", // Semi-transparent border
    color: "white", // Text color
    overflow: "hidden",
    transition: "transform 0.2s ease-in-out",
    ":hover": {
      transform: "scale(1.05)",
    },
  };

  const trackImageStyle = {
    height: 200,
    width: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  };

  const contentStyle = {
    flexGrow: 1,
    color: "white",
    padding: "16px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255, 255, 255, 0.8) rgba(255, 255, 255, 0.3)",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#232E33",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#545454",
      borderRadius: "3px",
    },
  };

  return (
    <Card sx={trackCardStyle}>
      {track?.addedTrack.snippet?.thumbnails && (
        <img
          src={track?.addedTrack.snippet?.thumbnails?.default.url}
          alt={track?.addedTrack.snippet?.title || "Track Thumbnail"}
          style={trackImageStyle}
        />
      )}

      <CardContent sx={contentStyle}>
        <Typography variant="h6" component="h3" color="white" gutterBottom>
          {track?.addedTrack.snippet?.title || "Track Title Not Available"}
        </Typography>

        <Typography variant="body2" color="white">
          Video Owner:{" "}
            {track?.addedTrack.snippet?.videoOwnerChannelTitle ||
              "Unknown Channel"}
         
          </Typography>
          <Typography variant="body2" color="white">
            Duration: {millisecondsToTime(track?.searchResult.videoDuration)}
          </Typography>
          <Typography variant="body2" color="white">
            {<a href="track?.searchResult.videoUrl">Listen on Youtube</a> || "No url specified"}
          </Typography>
       
      </CardContent>
    </Card>
  );
};

export default YoutubeTrackCard;
