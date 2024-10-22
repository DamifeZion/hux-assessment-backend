import express from "express";
import {
   deleteContact,
   editContact,
   getContactDetails,
   getContacts,
} from "../controllers/contact-ctrl";
import { jwtVerifyAuth } from "../middlewares/jwt-verify-auth";

const contactRoute = express.Router();

// Protect route from unAuthenticated users
contactRoute.use(jwtVerifyAuth);

contactRoute.get("/", getContacts);
contactRoute.get("/:id", getContactDetails);
contactRoute.put("/:id", editContact);
contactRoute.delete("/:id", deleteContact);

export default contactRoute;
