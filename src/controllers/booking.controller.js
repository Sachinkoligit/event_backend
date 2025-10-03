import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";

export const bookSeat = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const booking = await Booking.findOne({ eventId, userId });
    const actualEvent = await Event.findById(eventId);

    if (!actualEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (actualEvent.totalBooking <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    if (!booking) {
      await Booking.create({ eventId, userId, booking: 1 });
      actualEvent.totalBooking -= 1;
      await actualEvent.save();
      return res
        .status(201)
        .json({ message: "Seat booked successfully", event: actualEvent });
    }

    if (booking.booking >= 2) {
      return res.status(400).json({ message: "A user can book 2 seats only" });
    }

    booking.booking += 1;
    await booking.save();
    actualEvent.totalBooking -= 1;
    await actualEvent.save();

    return res.status(200).json({ message: "Seat booked", event: actualEvent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
