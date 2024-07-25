import React, { useState } from "react";
import {
  Grid,
  Container,
  Tabs,
  Tab,
  Pagination,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import YoutubeTabPanel from "../components/Youtube/YoutubeTabPanel";
import YoutubeTrackCard from "../components/Youtube/YoutubeTrackCard";
import YoutubeErrorTrackCard from "../components/Youtube/YoutubeErrorTrackCard";
import LoadingSkeleton from "../components/Skeleton/LoadingSkeleton";
import useYoutubeTracks from "../hooks/useYoutubeTracks";

const YoutubeTracks = () => {
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
    try {
      await getYoutubeSongs(tracks, playlistId);
      if (error) {
        console.error("Error fetching songs:", error.message);
        toast.error(error.message);
      }
    } catch (err) {
      console.error("Error fetching songs:", err.message);
      toast.error(err.message);
    } finally {
      setFetching(false);
    }
  };

  const [tabValue, setTabValue] = useState(0);
  const [addedPage, setAddedPage] = useState(1);
  const [unAddedPage, setUnAddedPage] = useState(1);
  const songsPerPageAdded = 6;
  const songsPerPageUnAdded = 9;

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
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="md" sx={{ paddingY: 2, color: "#fff" }}>
      {addedSongs.length > 0 || unAddedSongs.length > 0 || error ? (
        <>
          <Box
            sx={{
              position: "sticky",
              width: "100%",
              overflowX: "auto",
              mb: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="tabs"
              TabIndicatorProps={{ style: { backgroundColor: "#fff" } }}
              sx={{
                "& .MuiTab-root": {
                  color: "#fff",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  padding: { xs: "6px 12px", sm: "8px 16px" }, // Responsive padding
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
              <Tab label="Successful Songs" />
              <Tab label="Unsuccessful Songs" />
            </Tabs>
          </Box>
          <YoutubeTabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {filteredAddedSongs.map((song, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <YoutubeTrackCard track={song} />
                </Grid>
              ))}
            </Grid>
            {addedSongs.length > songsPerPageAdded && (
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={Math.ceil(addedSongs.length / songsPerPageAdded)}
                  page={addedPage}
                  onChange={handleChangeAddedPage}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#fff",
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      color: "#fff",
                    },
                    "& .MuiPaginationItem-root.Mui-focusVisible": {
                      color: "#fff",
                    },
                    "& .MuiPaginationItem-root:not(.Mui-selected)": {
                      color: "#999",
                    },
                  }}
                />
              </Box>
            )}
          </YoutubeTabPanel>
          <YoutubeTabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {filteredUnAddedSongs.map((song, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <YoutubeErrorTrackCard song={song} />
                </Grid>
              ))}
            </Grid>
            {unAddedSongs.length > songsPerPageUnAdded && (
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={Math.ceil(unAddedSongs.length / songsPerPageUnAdded)}
                  page={unAddedPage}
                  onChange={handleChangeUnAddedPage}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#fff",
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      color: "#fff",
                    },
                    "& .MuiPaginationItem-root.Mui-focusVisible": {
                      color: "#fff",
                    },
                    "& .MuiPaginationItem-root:not(.Mui-selected)": {
                      color: "#999",
                    },
                  }}
                />
              </Box>
            )}
          </YoutubeTabPanel>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {!fetching && fetching !== null ? (
            <>
              <Typography variant="h4" sx={{ mb: 2 }}>
                No songs found in the playlist.
              </Typography>
              <Button
                onClick={handleNavigateHome}
                variant="contained"
                color="primary"
                size="large"
              >
                Go Back Home
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>
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
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

export default YoutubeTracks;
