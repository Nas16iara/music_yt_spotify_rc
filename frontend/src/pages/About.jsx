import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          color: "common.white",
          padding: 4,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          About SpotieTube
        </Typography>
        <Typography variant="body1" paragraph>
          Convert your Spotify playlists to YouTube playlists effortlessly with
          SpotieTube. Streamline the process of enjoying your favorite music
          across platforms.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Key Features
        </Typography>
        <ul>
          <li>Convert Spotify playlists to YouTube playlists.</li>
          <li>Automatic synchronization of playlist content.</li>
          <li>User-friendly interface for easy navigation.</li>
          <li>Secure OAuth authentication with Spotify and YouTube APIs.</li>
          <li>Real-time updates and notifications.</li>
        </ul>

        <Typography variant="h5" gutterBottom>
          How It Works
        </Typography>
        <ol>
          <li>
            Connect your Spotify and YouTube accounts using OAuth
            authentication.
          </li>
          <li>Select the Spotify playlist you want to convert.</li>
          <li>
            Customize settings (if applicable) and initiate the conversion
            process.
          </li>
          <li>Sit back and let SpotieTube sync your playlists to YouTube.</li>
        </ol>

        <Typography variant="h5" gutterBottom>
          Technical Details
        </Typography>
        <ul>
          <li>
            SpotieTube uses the Spotify Web API for retrieving playlist data and
            the YouTube Data API for managing YouTube playlists.
          </li>
          <li>
            Secure OAuth 2.0 authentication ensures that your account
            information remains protected.
          </li>
          <li>
            Built with React for the frontend and Node.js for the backend,
            ensuring scalability and performance.
          </li>
        </ul>

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started Today
        </Button>
      </Box>

      <Divider />

      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Have questions or feedback? Contact us at{" "}
          <Link href="mailto:your-email@example.com">
            your-email@example.com
          </Link>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} SpotieTube. All rights reserved.
      </Typography>
    </Container>
  );
};

export default AboutPage;
