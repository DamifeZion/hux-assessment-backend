import nodemailer from "nodemailer";
import path from "path";
import { CONFIG } from "../config";
import { errorThrow } from "./error-throw";

const transporter = nodemailer.createTransport({
   service: CONFIG.EMAIL_SERVICE,
   auth: {
      user: CONFIG.EMAIL_USER,
      pass: CONFIG.EMAIL_PASSWORD,
   },
});

export type TMailOption = {
   subject: string;
   text: string;
   receiver: string;
   sender?: string | null;
};

export const sendTextEmail = async (options: TMailOption) => {
   try {
      await transporter.sendMail({
         from: `${CONFIG.COMPANY_NAME} <${options.sender || CONFIG.EMAIL_USER}>`,
         to: options.receiver,
         subject: options.subject,
         html: options.text,
      });

      return true;
   } catch (err) {
      errorThrow(err);
   }
};
