import express from "express";
import authRoutes from "../routes/auth.route.js";
import eventRoutes from "../routes/event.route.js";
import adminRoutes from "../routes/admin.route.js";
import { configDotenv } from "dotenv";
import { connect } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "event-frontend-orcin.vercel.app",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5001, () => {
  console.log("Server is Running on:" + PORT);
  connect();
});
