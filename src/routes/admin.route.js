import express from "express";
import {
  login,
  logout,
  check,
  //   update,
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/login", login);

// router.put("/update", protectRoute, update);

router.get("/logout", logout);

router.get("/check", protectRoute, check);

export default router;
