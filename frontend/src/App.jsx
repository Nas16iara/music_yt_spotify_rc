import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import GetStarted from "./pages/GetStarted.jsx";

import SpotifyYoutube from "./pages/SpotifyYoutube.jsx";
import SpotifyTracks from "./pages/SpotifyTracks.jsx";
import SpotifyPlaylist from "./pages/SpotifyPlaylist.jsx";

import Header from "./components/Header.jsx";

import YoutubeTracks from "./pages/YoutubeTracks.jsx";
import YoutubePlaylist from "./pages/YoutubePlaylist.jsx";
import TokenExpirationPopup from "./components/TokenExpirationPopup.jsx";

const App = () => {
  const { isLoggedIn, authUser } = useAuthContext();
  let name = null;
  if (isLoggedIn) {
    name = authUser.name;
  }
  return (
    <>
      <Header authenticated={isLoggedIn} fullName={name} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Profile /> : <LandingPage />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/profile" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/profile" /> : <SignUp />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
        />

        <Route path="/start" element={<GetStarted />} />
        <Route path="/transfer" element={<SpotifyYoutube />} />
        <Route path="/spotify-playlist" element={<SpotifyPlaylist />} />
        <Route path="/spotify-tracks/:playlistId" element={<SpotifyTracks />} />

        <Route path="/youtube-tracks" element={<YoutubeTracks />} />
        <Route path="/youtube-playlist" element={<YoutubePlaylist />} />

      </Routes>
      <Toaster />
      <TokenExpirationPopup />
    </>
  );
};

export default App;
