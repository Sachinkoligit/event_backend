import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(500).json({ message: "Fill all the details" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin Not Found" });
    }

    if (password !== admin.password) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    //generate jwt token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      secure: true,     
      sameSite: "None",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const check = async (req, res) => {
  try {
    return res.status(200).json(req.admin);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

