import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    // console.log(token);
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!user) {
      res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};
