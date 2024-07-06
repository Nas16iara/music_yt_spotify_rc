import express from "express";
import {
  tokenExpiration,
  tokenLogout,
  refresh,
} from "../controllers/tokens.controller.js";
const router = express.Router();

router.get("/checkTokenExpiration", tokenExpiration);
router.get("/refreshToken", refresh);
router.get("/tokenLogout", tokenLogout);

export default router;

