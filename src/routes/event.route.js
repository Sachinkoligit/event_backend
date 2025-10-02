import express from "express";
import {
  create,
  login,
  logout,
  check,
  events,
  bookSeat,
  remove,
} from "../controllers/event.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/events", events);

router.post("/create", create);

router.post("/login", login);

// router.put("/update", protectRoute, update);

router.get("/logout", logout);

router.put("/book/:id", bookSeat);

router.delete("/remove/:id", remove);

router.get("/check", protectRoute, check);

export default router;
