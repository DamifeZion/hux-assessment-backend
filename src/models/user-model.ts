import { Document } from "mongoose";
import mongoose from "mongoose";

export type UserDocument = Document & {
   _id: string;
   email: string;
   password: string;
   emailActive: boolean;
   updatedAt: Date;
   createdAt: Date;
};

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         unique: true,
         required: true,
         lowercase: true,
      },
      emailActive: {
         type: Boolean,
         default: false,
      },
      password: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

export const userModel = mongoose.model("Users", userSchema);
