import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index"; // Adjust the path to your app's entry file
import { contactModel } from "../models/contact-model";

// Mock JWT authentication middleware to skip actual authentication
jest.mock("../middlewares/jwt-verify-auth", () => ({
   jwtVerifyAuth: jest.fn((req, res, next) => next()),
}));

// Mock Mongoose model methods
jest.mock("../models/contact-model", () => ({
   contactModel: {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
   },
}));

describe("Contact Routes", () => {
   afterAll(() => {
      mongoose.connection.close();
   });

   describe("GET /api/v1/contact", () => {
      it("should return all contacts for the authenticated user", async () => {
         const mockContacts = [
            {
               _id: "1",
               firstname: "John",
               lastname: "Doe",
               phone: "+123456789",
            },
            {
               _id: "2",
               firstname: "Jane",
               lastname: "Smith",
               phone: "+987654321",
            },
         ];

         (contactModel.find as jest.Mock).mockResolvedValue(mockContacts);

         const response = await request(app).get("/api/v1/contact");

         expect(response.status).toBe(200);
         expect(response.body.contacts).toEqual(mockContacts);
      });

      it("should return 404 if no contacts are found", async () => {
         (contactModel.find as jest.Mock).mockResolvedValue([]);

         const response = await request(app).get("/api/v1/contact");

         expect(response.status).toBe(404);
         expect(response.body.message).toBe("No contacts found.");
      });
   });

   describe("GET /api/v1/contact/:id", () => {
      it("should return contact details for a given ID", async () => {
         const mockContact = {
            _id: "1",
            firstname: "John",
            lastname: "Doe",
            phone: "+123456789",
         };

         (contactModel.findById as jest.Mock).mockResolvedValue(mockContact);

         const response = await request(app).get("/api/v1/contact/1");

         expect(response.status).toBe(200);
         expect(response.body.contact).toEqual(mockContact);
      });

      it("should return 404 if contact is not found", async () => {
         (contactModel.findById as jest.Mock).mockResolvedValue(null);

         const response = await request(app).get("/api/v1/contact/123");

         expect(response.status).toBe(404);
         expect(response.body.message).toBe("Contact not found.");
      });
   });

   describe("POST /api/v1/contact", () => {
      it("should create a new contact", async () => {
         const newContact = {
            firstname: "John",
            lastname: "Doe",
            phone: "+123456789",
         };

         (contactModel.create as jest.Mock).mockResolvedValue(newContact);

         const response = await request(app)
            .post("/api/v1/contact")
            .send(newContact);

         expect(response.status).toBe(201);
         expect(response.body.contact).toEqual(newContact);
      });

      it("should return 400 if required fields are missing", async () => {
         const response = await request(app).post("/api/v1/contact").send({
            firstname: "John",
         });

         expect(response.status).toBe(400);
         expect(response.body.message).toBe(
            "First name, last name, and phone are required"
         );
      });
   });

   describe("PUT /api/v1/contact/:id", () => {
      it("should update an existing contact", async () => {
         const updatedContact = {
            firstname: "Jane",
            lastname: "Doe",
            phone: "+123456789",
         };

         (contactModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
            updatedContact
         );

         const response = await request(app)
            .put("/api/v1/contact/1")
            .send(updatedContact);

         expect(response.status).toBe(200);
         expect(response.body.message).toBe(
            "Contact Jane updated successfully"
         );
      });

      it("should return 404 if contact is not found", async () => {
         (contactModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

         const response = await request(app).put("/api/v1/contact/123").send({
            firstname: "Jane",
            lastname: "Doe",
            phone: "+123456789",
         });

         expect(response.status).toBe(404);
         expect(response.body.message).toBe("Contact does not exist");
      });
   });

   describe("DELETE /api/v1/contact/:id", () => {
      it("should delete a contact by ID", async () => {
         const mockDeletedContact = {
            _id: "1",
            firstname: "John",
            lastname: "Doe",
         };

         (contactModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
            mockDeletedContact
         );

         const response = await request(app).delete("/api/v1/contact/1");

         expect(response.status).toBe(200);
         expect(response.body.message).toBe(
            "Contact John deleted successfully"
         );
      });

      it("should return 404 if contact is not found", async () => {
         (contactModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

         const response = await request(app).delete("/api/v1/contact/123");

         expect(response.status).toBe(404);
         expect(response.body.message).toBe(
            "Failed to delete contact, because contact does not exist"
         );
      });
   });
});
