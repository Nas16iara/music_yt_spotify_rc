import express from "express";
import {
  signup,
  login,
  logout,
  isAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuth);

export default router;
