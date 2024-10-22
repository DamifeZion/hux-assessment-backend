import jwt from "jsonwebtoken";

export const createJwtToken = (
   payload: string | object,
   expiresIn: string | undefined
) => {
   const secret = process.env.SECRET_KEY;

   if (!secret) {
      throw new Error("Secret is not defined in the configuration");
   }

   return jwt.sign({ payload }, secret, { expiresIn });
};

export const verifyJwtToken = (token: string, secret?: string) => {
   const secretKey = secret || process.env.SECRET_KEY;

   if (!secretKey) {
      throw new Error("Secret is not defined in the configuration");
   }

   return jwt.verify(token, secretKey);
};

export const decodeJwtToken = (token: string) => {
   return jwt.decode(token);
};
