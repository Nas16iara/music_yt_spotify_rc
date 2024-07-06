import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const TokenExpirationPopup = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const checkTokenExpiration = async () => {
    try {
      const res = await fetch("/api/tokens/checkTokenExpiration", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (!(data.isSpotifyToken || data.isYoutubeToken)) {
        setOpen(true);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error checking token expiration:", error);
    }
  };

  const handleStayLoggedIn = async () => {
    try {
      setOpen(false); // Close the dialog
      const res = await fetch("/api/tokens/refreshToken", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success(data.message);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
      console.error("Error staying logged in:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/tokens/tokenLogout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Logged out successfully");
      setOpen(false); // Close the dialog
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Error logging out:", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Your session has expired. Do you want to stay logged in?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleStayLoggedIn} color="primary">
          Stay Logged In
        </Button>
        <Button onClick={handleLogout} color="primary">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenExpirationPopup;
