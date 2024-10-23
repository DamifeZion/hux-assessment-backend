import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { CONFIG } from "./config";

const swaggerOptions = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Contactly Web App API",
         version: CONFIG.VERSION_NO,
         description: "Api documentation for the Contactly Web App",
         contact: {
            name: "Damife Olaleye-Martins",
            email: "damifeolaleye@gmail.com",
         },
      },
      servers: [
         {
            url: CONFIG.SERVER_URL,
            description:
               process.env.NODE_ENV === "production"
                  ? "Production server"
                  : "Development server",
         },
      ],
   },
   apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
