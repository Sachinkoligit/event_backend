import express from "express";
import {
  login,
  logout,
  signup,
  check,
  update,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.put("/update", protectRoute, update);

router.get("/logout", logout);

router.get("/check", protectRoute, check);

export default router;
