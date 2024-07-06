/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useState, useRef } from "react";

const SpotifyTrackCard = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Custom styles using inline styles
  const trackCardStyle = {
    maxWidth: 300,
    height: 400,
    margin: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Glass effect background color with opacity
    backdropFilter: "blur(10px)", // Glass effect blur
    borderRadius: "8px",
    transition: "transform 0.2s ease-in-out",
    overflow: "hidden", // Ensure content overflow is hidden
    ":hover": {
      transform: "scale(1.05)", // Scale effect on hover
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
    scrollbarWidth: "thin", // Thin scrollbar for modern browsers
    scrollbarColor: "rgba(255, 255, 255, 0.8) rgba(255, 255, 255, 0.3)", // Custom scrollbar colors
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#232E33", // Track color
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#545454", // Thumb color
      borderRadius: "3px",
    },
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
  };

  // Function to handle playing the preview
  const playPreview = () => {
    if (track.preview_url) {
      if (audioRef.current) {
        audioRef.current.pause(); // Pause any currently playing audio
        audioRef.current.currentTime = 0; // Reset to beginning
      }
      const audio = new Audio(track.preview_url);
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      audioRef.current = audio; // Store reference to the audio element
    } else {
      alert("No preview available for this track.");
    }
  };

  // Function to stop playing the preview
  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to beginning
      setIsPlaying(false);
    }
  };

  return (
    <Card sx={trackCardStyle}>
      {/* Display track image if available */}
      {track.image_url && (
        <img
          src={track.image_url}
          alt={track.album.name}
          style={trackImageStyle}
        />
      )}

      <CardContent sx={contentStyle}>
        {/* Track name */}
        <Typography variant="h7" component="h4" color='white' gutterBottom>
          {track.name || "Track Name Not Available"}
        </Typography>

        {/* Artist */}
        <Typography variant="body2" color="white" gutterBottom>
          Artist:{" "}
          {(track.artists &&
            track.artists.map((artist) => artist.name).join(", ")) ||
            "Unknown Artist"}
        </Typography>

        {/* Album */}
        <Typography variant="body3" color="white" gutterBottom>
          Album: {track.album || track.album.name || "Unknown Album"}
        </Typography>

        {/* External URL */}
        <Typography variant="body2" color="primary">
          <a
            href={track.external_urls}
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen on Spotify
          </a>
        </Typography>
      </CardContent>

      {/* Button container */}
      <div style={buttonContainerStyle}>
        {/* Play button */}
        {!isPlaying ? (
          <IconButton
            aria-label="play"
            onClick={playPreview}
            disabled={!track.preview_url}
          >
            <PlayArrowIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="stop" onClick={stopPreview}>
            <StopIcon />
          </IconButton>
        )}
      </div>
    </Card>
  );
};

export default SpotifyTrackCard;
