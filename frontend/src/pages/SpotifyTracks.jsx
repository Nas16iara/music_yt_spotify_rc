import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import useSpotifyTracks from "../hooks/useSpotifyTracks";

import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import SpotifyTrackCard from "../components/Spotify/SpotifyTrackCard";

import toast from "react-hot-toast";

import { Button, Container, Grid, Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const extractTrackData = (tracks) => {
  const trackDataAsString = tracks.map((track) => {
    const artistsString = track.artists.map((artist) => artist.name).join(", "); // Join artist names with a comma
    const duration = track.duration;
    const name = track.name;
    return {
      trackString: `"${name}""  ""${artistsString}" `,
      duration: duration,
      album: track.album,
    };
  });

  return trackDataAsString;
};

const SpotifyTracks = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const youtubePlaylistId = location.state?.youtubePlaylistId;
  const { playlistId } = useParams();
  console.log("Playlist ID is ", youtubePlaylistId);

  const { tracks, loading, getSpotifyTracks, error } = useSpotifyTracks();
  const [fetchingTracks, setFetchingTracks] = useState(false);

  const [selectedTracks, setSelectedTracks] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items to show per page

    // Pagination calculations
    const indexOfLastTrack = currentPage * itemsPerPage;
    const indexOfFirstTrack = indexOfLastTrack - itemsPerPage;
    const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);
  

  const handleYoutubeTransfer = async () => {
    const selectedTrackData = extractTrackData(selectedTracks);
    console.log("All Songs selected: ", selectedTrackData);

    navigate("/youtube-tracks", {
      state: { youtubePlaylistId, trackData: selectedTrackData },
    });

  };

  const navigateToPlaylist = () => {
    navigate("/spotify-playlist");
  };

  const handleSelectTrack = (track) => {
    console.log("Selected track ID: ", track);
    const isSelected = selectedTracks.some((t) => t.id === track.id);
    if (isSelected) {
      setSelectedTracks(selectedTracks.filter((t) => t.id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };
  const handleSelectAll = () => {
    console.log("Selecting all tracks: ", tracks);
    setSelectedTracks(tracks);
    setAllSelected(true);
  };

  const handleNotSelectAll = () => {
    setSelectedTracks([]);
    setAllSelected(false);
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setFetchingTracks(true); // Set fetching state to true
        await getSpotifyTracks(playlistId); // Fetch tracks for the specified playlistId
        setFetchingTracks(false); // Set fetching state back to false after fetching
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
        setFetchingTracks(false); // Ensure to set fetching state back to false on error
      }
    };

    if (playlistId && tracks?.length === 0 && !fetchingTracks && !error) {
      fetchTracks(); // Only fetch tracks when playlistId changes or tracks are empty and not already fetching
      console.log("TRACKS ", tracks);
    }


    if (error) {
      toast.error(error);
      console.log(error);
    }
  }, [
    playlistId,
    getSpotifyTracks,
    tracks,
    fetchingTracks,
    setFetchingTracks,
    error,
  ]);

  if (error) {
    return (
      <>
        <div
          style={{
            color: "white",
            fontSize: "20pt",
            textAlign: "center",
            padding: "10px",
          }}
        >
          SpotifyTracks
        </div>
        <div style={{ color: "white", fontSize: "20pt", textAlign: "center" }}>
          {error === "No tracks found in playlist"
            ? "No tracks available in this playlist."
            : "Failed to fetch tracks. Please try again."}
        </div>
        <Button
          variant="contained"
          onClick={navigateToPlaylist}
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          Go to Home
        </Button>
      </>
    );
  }
  return (
    <>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '33vh',
          flexGrow: 1,
        }}
      >
        <Typography variant="h7" component="h4" gutterBottom style={{ color: 'white', fontSize: '20pt', textAlign: 'center', padding: '3px' }}>
          SpotifyTracks
        </Typography>
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Button
            onClick={handleYoutubeTransfer}
            style={{
              color: 'white',
              backgroundColor: 'green',
              fontSize: '10pt',
              textAlign: 'center',
              borderRadius: '12px',
              padding: '10px',
              marginTop: '20px',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
            startIcon={<YouTubeIcon />}
          >
            Transfer to Youtube
          </Button>
        </Container>
        <Container
          sx={{
            margin: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {allSelected ? (
            <Button variant="contained" onClick={handleNotSelectAll}>
              Remove All Selected
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSelectAll}>
              Select All
            </Button>
          )}
        </Container>
      </Container>
      <Container>
      {/* Pagination controls */}
      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ marginRight: '10px' }}
        >
          Previous
        </Button>
        <Button
          disabled={currentTracks.length < itemsPerPage || currentTracks.length === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </Container>
        <Typography variant="h7" component="h4" gutterBottom style={{ color: 'white', textAlign: 'left', marginLeft: '20px' }}>
          Songs in Playlist
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {loading ? (
            <LoadingSkeleton />
          ) : currentTracks.length > 0 ? (
            currentTracks.map((track) => (
              <Grid item key={track.id} xs={12} sm={6} md={4} lg={3}>
                <SpotifyTrackCard
                  track={track}
                  selected={selectedTracks.some((t) => t.id === track.id)}
                  onSelect={() => handleSelectTrack(track)}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" style={{ color: 'white' }}>
              No tracks available.
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );

};

export default SpotifyTracks;
