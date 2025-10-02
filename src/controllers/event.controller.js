import Event from "../models/event.model.js";
import jwt from "jsonwebtoken";

export const create = async (req, res) => {
  try {
    const { name, date, location, description, totalBooking } = req.body;
    if (!name || !date || !location || !description || !totalBooking) {
      return res.status(500).json({ message: "Fill the details properly" });
    }
    const event = {
      name,
      date,
      location,
      description,
      totalBooking,
    };

    await Event.create(event);
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(500).json({ message: "Fill all the details" });
    }
    if (
      email !== process.env.admin_email ||
      password !== process.env.admin_password
    ) {
      return res.status(500).json({ message: "Invalid Admin" });
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

    res.status(200).json({ message: "LoggedIn Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const events = async (req, res) => {
  try {
    const allEvents = await Event.find(); // Fetches all documents from the 'events' collection
    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const bookSeat = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.totalBooking <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    event.totalBooking -= 1;
    await event.save();

    res.status(200).json({ message: "Seat booked", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "deleted Successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
