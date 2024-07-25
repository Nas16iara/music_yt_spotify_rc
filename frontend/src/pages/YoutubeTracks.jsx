import { Grid, Container, Tabs, Tab, Pagination, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import YoutubeTabPanel from "../components/Youtube/YoutubeTabPanel";
import YoutubeTrackCard from "../components/Youtube/YoutubeTrackCard";
import YoutubeErrorTrackCard from "../components/Youtube/YoutubeErrorTrackCard";
import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import useYoutubeTracks from "../hooks/useYoutubeTracks";

const YoutubeTracks = () => {
  // Backend specific initialization
  const navigate = useNavigate();
  const location = useLocation();

  const playlistId = location?.state?.youtubePlaylistId;
  const tracks = location?.state?.trackData;
  const [fetching, setFetching] = useState(null);
  const { loading, getYoutubeSongs, addedSongs, unAddedSongs, error } =
    useYoutubeTracks();

  const handleNavigateHome = () => {
    navigate("/");
  };

  const beginFetchingSongs = async () => {
    setFetching(true);
    console.log(tracks);
    try {
      await getYoutubeSongs(tracks, playlistId);
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      console.error("Error fetching songs:", err.message);
      toast.error(err.message);
    } finally {
      setFetching(false);
    }
  };

  // Tab and Pagination initialization
  const [tabValue, setTabValue] = useState(0);
  const [addedPage, setAddedPage] = useState(1);
  const [unAddedPage, setUnAddedPage] = useState(1);
  const songsPerPageAdded = 6; // Number of songs per page
  const songsPerPageUnAdded = 9; // Number of songs per page

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeAddedPage = (event, newPage) => {
    setAddedPage(newPage);
  };

  const handleChangeUnAddedPage = (event, newPage) => {
    setUnAddedPage(newPage);
  };

  const filteredAddedSongs = addedSongs.slice(
    (addedPage - 1) * songsPerPageAdded,
    addedPage * songsPerPageAdded
  );

  const filteredUnAddedSongs = unAddedSongs.slice(
    (unAddedPage - 1) * songsPerPageUnAdded,
    unAddedPage * songsPerPageUnAdded
  );

  if (loading || fetching) {
    return (
    <LoadingSkeleton />
  );
  }

  if (addedSongs.length > 0 || unAddedSongs.length > 0) {
    return (
      <Container color="white">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          centered
          TabIndicatorProps={{ style: { backgroundColor: "#301934" } }} // Example indicator color
          sx={{
            "& .MuiTab-root": {
              color: "#fff",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#fff",
            },
            "& .MuiTab-root.Mui-focusVisible": {
              color: "#fff",
            },
            "& .MuiTab-root:not(.Mui-selected)": {
              color: "#999",
            },
          }}
        >
          <Tab label="Songs Added to Youtube Playlist" />
          <Tab label="Songs Not Added to Youtube Playlist" />
        </Tabs>
        <YoutubeTabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {filteredAddedSongs.map((song, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <YoutubeTrackCard track={song} />
              </Grid>
            ))}
          </Grid>
          {addedSongs.length > songsPerPageAdded && (
            <Pagination
              count={Math.ceil(addedSongs.length / songsPerPageAdded)}
              page={addedPage}
              onChange={handleChangeAddedPage}
              color="primary"
              sx={{
                marginTop: "20px",
                justifyContent: "center",
                color: "#fff", // Pagination text color
                "& .MuiPaginationItem-root": {
                  color: "#fff", // Default text color
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  color: "#fff", // Selected page text color
                },
                "& .MuiPaginationItem-root.Mui-focusVisible": {
                  color: "#fff", // Focused page text color
                },
                "& .MuiPaginationItem-root:not(.Mui-selected)": {
                  color: "#999", // Unselected page text color
                },
              }}
            />
          )}
        </YoutubeTabPanel>
        <YoutubeTabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {filteredUnAddedSongs.map((song, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <YoutubeErrorTrackCard song={song} />
              </Grid>
            ))}
          </Grid>
          {unAddedSongs.length > songsPerPageAdded && (
            <Pagination
              count={Math.ceil(unAddedSongs.length / songsPerPageUnAdded)}
              page={unAddedPage}
              onChange={handleChangeUnAddedPage}
              color="primary"
              sx={{
                marginTop: "20px",
                justifyContent: "center",
                color: "#fff", // Pagination text color
                "& .MuiPaginationItem-root": {
                  color: "#fff", // Default text color
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  color: "#fff", // Selected page text color
                },
                "& .MuiPaginationItem-root.Mui-focusVisible": {
                  color: "#fff", // Focused page text color
                },
                "& .MuiPaginationItem-root:not(.Mui-selected)": {
                  color: "#999", // Unselected page text color
                },
              }}
            />
          )}
        </YoutubeTabPanel>
      </Container>
    );
  }

  // If no songs found
  return (
    <Container color="white">
      {!fetching && fetching !== null ? (
        <>
          <h1>No songs found in the playlist.</h1>
          <Button onClick={handleNavigateHome}>Go Back Home</Button>
        </>
      ) : (
        <div  style={{ color: "#fff", display: 'flex', flexDirection: 'column',  justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h4" sx={{ mb: 4, mt: 4}}>
          Click Here to add songs to the playlist
        </Typography>
        <Button
          onClick={beginFetchingSongs}
          variant="contained"
          color="primary"
          size="large"
        >
          Fetch Songs
        </Button>
        </div>
      )}
    </Container>
  );
};

export default YoutubeTracks;
