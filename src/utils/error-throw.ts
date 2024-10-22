import { Response } from "express";
import { responseHandler } from "./responseHandler";

export const errorThrow = (
   err: unknown,
   res?: Response,
   message = "Internal Server Error"
) => {
   // Log the error
   if (err instanceof Error) {
      console.error(err.message);
   } else {
      console.error(err);
   }

   // If a response object is provided, send the error response
   if (res) {
      return responseHandler(res, 500, message);
   }
};
