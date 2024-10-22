import crypto from "crypto";
import { tokenModel } from "../models/token-model";

export const generateSixDigitCode = async () => {
   try {
      let token = crypto.randomInt(100000, 999999);

      let existingToken = await tokenModel.findOne({ token });

      // if the token already exist, generate a new one
      while (existingToken) {
         token = crypto.randomInt(100000, 999999);
         existingToken = await tokenModel.findOne({ token });
      }

      return token.toString();
   } catch (error) {
      console.log("Error generating token: ", error);
   }
};
