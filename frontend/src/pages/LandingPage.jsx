import { Box, Typography, Button } from "@mui/material";
import { PlayCircleOutline as PlayIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// TODO: Make mobile friendly
const LandingPage = () => {
  const navigate = useNavigate();
  const handleButton = () => {
    // TODO: Implement button to go to the login page
    navigate("/login");
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(10px)",
          color: "common.white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "600px",
            p: 4,
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            bgcolor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, color: "common.black" }}>
            Want to enjoy your music while transferring over your Spotify music
            to another platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
            Click here to get started
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleButton}
          >
            <PlayIcon sx={{ mr: 1 }} /> Get Started
          </Button>
        </Box>
      </Box>

      
    </>
  );
};

export default LandingPage;
