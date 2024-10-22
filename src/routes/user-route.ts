import express from "express";

/** Local Modules */
import {
   forgotPassword,
   getUserDetails,
   login,
   register,
   resetPassword,
   validateEmail,
} from "../controllers/user-ctrl";

const userRoute = express.Router();

userRoute.get("/:id", getUserDetails); // Get the user details
userRoute.post("/login", login); //Sign In using email
userRoute.post("/register", register); // Sign Up using email
userRoute.post("/activate-account", validateEmail); // Validate emails
userRoute.post("/forgot-password", forgotPassword); // Request password update
userRoute.put("/reset_password/:resetToken", resetPassword); // Update password;

export default userRoute;
