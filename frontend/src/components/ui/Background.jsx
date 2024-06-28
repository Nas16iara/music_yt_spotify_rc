import { Box } from "@mui/material";

const Background = ({ children }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        overflow: "hidden",
        overflowY: "auto",
        backgroundColor: "#0F172A",
      }}
    >
      {/* Main content */}
      {children}
      {/* Left bottom circle */}
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: "-20%", // Adjust position to exceed height
          left: "-10%", // Adjust position within width
          height: "300px", // Adjust size
          width: "300px", // Adjust size
          borderRadius: "50%", // Rounded shape
          background:
            "radial-gradient(circle farthest-side, rgba(255, 0, 182, 0.15), rgba(255, 255, 255, 0))", // Radial gradient
          zIndex: -1,
        }}
      />
      {/* Right bottom circle */}
      <Box
        component="div"
        sx={{
          position: "absolute",
          bottom: "-20%", // Adjust position to exceed height
          right: "-10%", // Adjust position within width
          height: "300px", // Adjust size
          width: "300px", // Adjust size
          borderRadius: "50%", // Rounded shape
          background:
            "radial-gradient(circle farthest-side, rgba(255, 0, 182, 0.15), rgba(255, 255, 255, 0))", // Radial gradient
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default Background;
