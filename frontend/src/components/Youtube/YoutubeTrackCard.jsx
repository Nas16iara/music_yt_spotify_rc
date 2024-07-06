/* eslint-disable react/prop-types */
import { Card, CardContent, Typography } from "@mui/material";

const YoutubeTrackCard = ({ track }) => {
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
      {track.thumbnail && (
        <img
          src={track.thumbnail}
          alt={track.title || "Track Thumbnail"}
          style={trackImageStyle}
        />
      )}

      <CardContent sx={contentStyle}>
        <Typography variant="h6" component="h3" color="white" gutterBottom>
          {track.title || "Track Title Not Available"}
        </Typography>

        <Typography variant="body2" color="white">
          Video URL:{" "}
          <a
            href={track.videoUrl || ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
          </a>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default YoutubeTrackCard;
