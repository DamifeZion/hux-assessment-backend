import { Request, Response } from "express";
import { errorThrow } from "../utils/error-throw";
import { UserDocument } from "../models/user-model";
import { contactModel } from "../models/contact-model";
import { responseHandler } from "../utils/responseHandler";
import validator from "validator";
import mongoose from "mongoose";

export const getContacts = async (req: Request, res: Response) => {
   try {
      const user = req.user as UserDocument;

      const contacts = await contactModel
         .find({ userId: user._id })
         .select("-userId -__v");

      responseHandler(res, 200, null, contacts);
   } catch (err) {
      errorThrow(err, res);
   }
};

export const createContact = async (req: Request, res: Response) => {
   try {
      const user = req.user as UserDocument;
      const { firstname, lastname, phone } = req.body;

      if (!firstname) {
         return responseHandler(res, 404, "Firstname is required");
      }

      if (!lastname) {
         return responseHandler(res, 404, "Firstname is required");
      }

      if (!phone) {
         return responseHandler(res, 404, "Firstname is required");
      }

      if (!validator.isMobilePhone(phone)) {
         return responseHandler(res, 404, "Please enter a valid phone number");
      }

      //Check if the phone already exist for that user;
      const existingPhone = await contactModel.findOne({
         phone,
         userId: user._id,
      });

      console.log(existingPhone)

      if (existingPhone) {
         return responseHandler(
            res,
            404,
            `The phone number ${phone} is already associated with contact ${existingPhone.firstname} ${existingPhone.lastname}`
         );
      }

      await contactModel.create({
         firstname,
         lastname,
         phone,
         userId: user._id,
      });

      responseHandler(res, 201, `Contact ${firstname} created successfully`);
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const getContactDetails = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      // Check if the id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return responseHandler(res, 400, "Invalid contact ID");
      }
      const contact = await contactModel.findById(id).select("-userId");

      if (!contact) {
         return responseHandler(res, 404, "Contact not found");
      }

      return responseHandler(res, 200, "Contact details found", contact);
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const editContact = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { firstname, lastname, phone } = req.body;

      // Check if the id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return responseHandler(res, 400, "Invalid contact ID");
      }

      const contact = await contactModel.findByIdAndUpdate(
         id,
         {
            firstname,
            lastname,
            phone,
         },
         {
            new: true,
         }
      );

      if (!contact) {
         return responseHandler(res, 404, "Contact does not exist");
      }

      responseHandler(
         res,
         200,
         `Contact ${contact?.firstname} updated successfully`
      );
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const deleteContact = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return responseHandler(res, 400, "Invalid contact ID");
      }

      const deletedContact = await contactModel.findByIdAndDelete(id);

      if (!deletedContact) {
         return responseHandler(
            res,
            404,
            "Failed to delete contact, because contact does not exist"
         );
      }

      responseHandler(
         res,
         200,
         `Contact ${deletedContact?.firstname} deleted successfully`
      );
   } catch (err) {
      return errorThrow(err, res);
   }
};
