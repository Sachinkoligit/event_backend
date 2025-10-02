import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin = await Admin.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!admin) {
      return res.status(401).json({ message: "User not found" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
