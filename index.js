import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import eventRoutes from "./src/routes/event.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import { configDotenv } from "dotenv";
import { connect } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.send("Backend is live 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5001, () => {
  console.log("Server is Running on:" + PORT);
  connect();
});
