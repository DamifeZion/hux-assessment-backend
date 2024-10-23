import express from "express";
import {
   deleteContact,
   editContact,
   getContactDetails,
   getContacts,
} from "../controllers/contact-ctrl";
import { jwtVerifyAuth } from "../middlewares/jwt-verify-auth";
import { contactDocs as docs } from "../documentation/contact-docs";

const contactRoute = express.Router();

// Protect route from unAuthenticated users
contactRoute.use(jwtVerifyAuth);

docs.header();

docs.getContacts();
contactRoute.get("/", getContacts);

docs.getContactDetails();
contactRoute.get("/:id", getContactDetails);

docs.editContact();
contactRoute.put("/:id", editContact);

docs.deleteContact();
contactRoute.delete("/:id", deleteContact);

export default contactRoute;
