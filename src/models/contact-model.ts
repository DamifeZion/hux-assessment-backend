import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
   userId: { type: String, required: true },
   firstname: { type: String, required: true },
   lastname: { type: String, required: true },
   phone: { type: String, required: true },
});

export const contactModel = mongoose.model("contact", contactSchema);
