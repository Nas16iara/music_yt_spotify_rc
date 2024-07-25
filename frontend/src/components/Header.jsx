/* eslint-disable react/prop-types */
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import { CircularProgress } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0097B2",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const Header = ({ authenticated, fullName }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, loading } = useLogout();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Perform logout actions here if needed
    await logout();
    navigate("/"); // Navigate to login page after logout
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {authenticated ? `Hello, ${fullName}` : "SpotieTube"}
            </Typography>
            {authenticated ? (
              <Button color="inherit" onClick={handleLogout} disabled={loading}>
                {loading ? <CircularProgress /> : "Logout"}
              </Button>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {authenticated
          ? [
              <MenuItem key="profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>,
              <MenuItem key="home" onClick={handleMenuClose}>
                Home
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                Logout
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" onClick={() => navigate("/login")}>
                Login
              </MenuItem>,
              <MenuItem key="signup" onClick={() => navigate("/signup")}>
                Signup
              </MenuItem>,
              <MenuItem key="getstarted" onClick={() => navigate("/start")}>
                Get Started
              </MenuItem>,
            ]}
      </Menu>
    </ThemeProvider>
  );
};

export default Header;
