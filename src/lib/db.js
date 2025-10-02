import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected..");
  } catch (err) {
    console.log("Db connection error", err);
  }
}
