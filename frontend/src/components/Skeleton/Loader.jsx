import { CircularProgress, Typography } from "@mui/material";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="loader">
      <CircularProgress size={60} thickness={4} />{" "}
      {/* Adjust size and thickness as needed */}
      <Typography variant="body1" className="loader-text">
        Loading...
      </Typography>
    </div>
  );
};

export default Loader;
