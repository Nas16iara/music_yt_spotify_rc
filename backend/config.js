import dotenv from "dotenv";

export function configureEnvironment() {
  dotenv.config();
  return {
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URL: process.env.YOUTUBE_REDIRECT_URL,
  };
}
