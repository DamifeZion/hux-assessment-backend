import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";

// Local Modules
import { userModel } from "../models/user-model";
import { responseHandler } from "../utils/responseHandler";
import { CONFIG } from "../config";
import { errorThrow } from "../utils/error-throw";

// Define a custom interface to extend the Request object's type definition
declare module "express" {
   interface Request {
      user?: Document | null;
   }
}

// For general authorization when basic user signed in
export const jwtVerifyAuth = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { authorization } = req.headers;

      if (!authorization) {
         return responseHandler(res, 401, "Authorization token required");
      }

      const token = authorization.split(" ")[1];

      // Error handling secret in env in case
      const secret = CONFIG.SECRET_KEY;

      // Here we handle error that comes from this logic, such as expired token, invalid signatures e.t.c
      const { payload } = jwt.verify(token, secret) as { payload: string };

      // Append the users nonsensitive data to a variable to grab easily anywhere middle ware is used
      req.user = await userModel.findOne({ _id: payload }).select("-password");

      if (!req.user) {
         return responseHandler(res, 401, "User not found");
      }

      next();
   } catch (error) {
      const errorMessage = (error as Error).message;

      // Check if the error is because of an expired or invalid token
      if (errorMessage === "jwt expired") {
         return responseHandler(res, 401, "Token expired");
      }

      if (
         errorMessage === "invalid token" ||
         errorMessage === "invalid signature"
      ) {
         return responseHandler(res, 401, "Invalid token");
      }

      errorThrow(error, res);
   }
};
