// server.js
import express from "express";
import session from "express-session";
import path from "path";
import MongoStore from "connect-mongo";
import cors from "cors";

import dotenv from "dotenv";
import { configureEnvironment } from "./config.js";

dotenv.config();
const config = configureEnvironment();

import { connectDB } from "./database/connectDB.js";

import passport from "passport";
import User from "./models/user.model.js";
import LocalStrategy from "passport-local";

// import job from './cron.js'; TODO: remove comment when we have proper url

import authRoutes from "./routes/auth.routes.js";
import spotifyRoutes from "./routes/spotify.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import tokenRoutes from "./routes/tokens.routes.js";

// job.start();  TODO: remove comment when we have proper url

const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  ttl: 1000 * 60 * 60 * 24 * 7,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.CRYPTO_SECRET,
  },
});

store.on("error", (err) => console.log("Session store error: ", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    },
    store: store,
  })
);

app.use(
  cors({
    origin: "https://music-yt-spotify-rc.onrender.com", // Replace with your frontend URL
    credentials: true, // Allows cookies to be sent and received across domains
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/tokens", tokenRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on ${PORT}`);
});
