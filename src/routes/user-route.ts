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
import { userDocs as docs } from "../documentation/user-docs";

const userRoute = express.Router();

docs.header();

docs.getUserDetails();
userRoute.get("/:id", getUserDetails);

docs.login();
userRoute.post("/login", login);

docs.register();
userRoute.post("/register", register);

docs.activateAccount();
userRoute.post("/activate-account", validateEmail);

docs.forgotPassword();
userRoute.post("/forgot-password", forgotPassword);

docs.resetPassword();
userRoute.put("/reset_password/:resetToken", resetPassword);

export default userRoute;
