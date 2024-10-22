import { config } from "dotenv";
config();

function getEnvVar(key: string, defaultValue?: string): string {
   const value = process.env[key] || defaultValue;
   if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
   }
   return value;
}

const PORT = getEnvVar("PORT", "8080");
export const CONFIG = {
   DB_CONN: getEnvVar("DB_CONN"),
   PORT,
   API_VERSION: getEnvVar("API_VERSION", "/api/v1"), // Default API version
   SECRET_KEY: getEnvVar("SECRET_KEY"),
   EMAIL_SERVICE: getEnvVar("EMAIL_SERVICE"),
   EMAIL_USER: getEnvVar("EMAIL_USER"),
   EMAIL_PASSWORD: getEnvVar("EMAIL_PASSWORD"),
   CLIENT_BASE_URL: getEnvVar("CLIENT_BASE_URL"),
   CLIENT_RESET_PASSWORD: getEnvVar("CLIENT_RESET_PASSWORD"),
   COMPANY_NAME: "Contactly",
   VERSION_NO: "1.0.0",
   SERVER_URL: "http://localhost:5000",
   TOKEN_MODEL_EXPIRATION: "3h",
   USER_SESSION_EXPIRATION: "7d",
};
