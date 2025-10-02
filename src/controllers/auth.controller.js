import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(500).json({ message: "Fill the details properly" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = {
      email,
      fullName,
      password: hashedPassword,
    };

    //generate jwt token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    await User.create(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(500).json({ message: "Fill all the details" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: "Invalid Password" });
    }

    //generate jwt token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).message(error.message);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const update = async (req, res) => {
  try {
    const { booking } = req.body;
    console.log(booking);
    const userEmail = req.user.email;
    // const user = await User.updateOne({ email }, { profilePic: profilePic });
    // if (!booking) {
    //   res.status(400).json({ message: "Something is Wrong" });
    // }
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { booking: booking },
      { new: true }
    );

    res.status(200).json({
      user: updatedUser,
      message: "Booked Successfully",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
