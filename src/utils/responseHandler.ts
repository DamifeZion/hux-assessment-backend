import { Response } from "express";

type TResponseHandler = (
   res: Response,
   status: number,
   message: string | null,
   data?: any
) => void;

export const responseHandler: TResponseHandler = (
   res,
   status,
   message,
   data = null
) => {
   const response = {
      success: status >= 200 && status < 300,
      status,
      message,
      data,
   };

   res.status(status).json(response);
};
