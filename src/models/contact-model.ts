import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
   userId: { type: String, required: true },
   firstname: { type: String, required: true, lowercase: true },
   lastname: { type: String, required: true, lowercase: true },
   phone: { type: Number, required: true, unique: true },
});

export const contactModel = mongoose.model("contact", contactSchema);
