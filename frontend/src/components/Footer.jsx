import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled footer component with transparency
const FooterContainer = styled(AppBar)(({ theme }) => ({
  top: "auto",
  bottom: 0,
  position: "relative", // Position relative to ensure it stays at the end
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  color: "white", // White text color
  padding: "1rem",
  backdropFilter: "blur(10px)", // Optional: adds a blur effect to the background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FooterContainer>
      <Toolbar
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <Typography
            variant="body2"
            align={isMobile ? "center" : "left"}
            style={{ marginBottom: isMobile ? "1rem" : "0" }}
          >
            &copy; 2024 SpotieTub. All rights reserved.
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.5rem",
            }}
          >
            <Button
              component={Link}
              to="/terms"
              color="inherit" // Inherit color from parent, which is white
              style={{ marginBottom: isMobile ? "0.5rem" : "0" }}
            >
              Terms and Conditions
            </Button>
            <Button
              component={Link}
              to="/privacy"
              color="inherit" // Inherit color from parent, which is white
            >
              Privacy Policy
            </Button>
          </div>
        </Container>
      </Toolbar>
    </FooterContainer>
  );
};

export default Footer;
