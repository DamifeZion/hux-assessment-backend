import mongoose from "mongoose";
import { CONFIG } from "../config";

const tokenSchema = new mongoose.Schema(
   {
      userId: { type: String },
      token: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      expires_at: {
         type: Date,
         default: Date.now,
         expires: CONFIG.TOKEN_MODEL_EXPIRATION,
      },
   },
   {
      timestamps: true,
   }
);

tokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
export const tokenModel = mongoose.model("tokens", tokenSchema);
