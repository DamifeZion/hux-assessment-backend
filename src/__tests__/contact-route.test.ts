import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index"; // Adjust the path to your app's entry file
import { contactModel } from "../models/contact-model";

// Mock JWT authentication middleware to skip actual authentication
jest.mock("../middlewares/jwt-verify-auth", () => ({
   jwtVerifyAuth: jest.fn((req, res, next) => {
      req.user = { _id: "mockUserId", email: "user@example.com" }; // Mock user
      next();
   }),
}));

// Mock Mongoose model methods
jest.mock("../models/contact-model", () => ({
   contactModel: {
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
   },
}));

describe("Contact Routes - Create and Update", () => {
   afterAll(async () => {
      await mongoose.disconnect(); // Ensure Mongoose disconnects after all tests
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
            .post("/api/v1/contact/add")
            .send(newContact);

         expect(response.status).toBe(201);
         expect(response.body.message).toBe(
            `Contact ${newContact.firstname} created successfully`
         );
      });

      it("should return 404 if required fields are missing", async () => {
         const response = await request(app).post("/api/v1/contact/add").send({
            firstname: "John", // Missing lastname and phone
         });

         expect(response.status).toBe(404);
         expect(response.body.message).toBe("Firstname is required");
      });

      it("should return 404 for invalid phone number", async () => {
         const newContact = {
            firstname: "John",
            lastname: "Doe",
            phone: "123", // Invalid phone number
         };

         const response = await request(app)
            .post("/api/v1/contact/add")
            .send(newContact);

         expect(response.status).toBe(404);
         expect(response.body.message).toBe(
            "Please enter a valid phone number"
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
            `Contact ${updatedContact.firstname} updated successfully`
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
});
