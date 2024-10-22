/** CONFIG Should come first. Dot_Env is initialised here */
import { CONFIG } from "./config";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { errorThrow } from "./utils/error-throw";

/** Route Imports */
import userRoute from "./routes/user-route";
import contactRoute from "./routes/contact-route";
import { swaggerDocs, swaggerUi } from "./swagger";

/** Express configurations */
const app: Application = express();
app.use(
   cors({
      origin: "*",
      credentials: true,
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Swagger Documentation */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/** Routes */
app.use(`${CONFIG.API_VERSION}/user`, userRoute);
app.use(`${CONFIG.API_VERSION}/contact`, contactRoute);

/** Server State */
app.get("/", (req: Request, res: Response) => {
   res.status(201).json("Home GET Request");
});

/** DB Connection */
mongoose
   .connect(CONFIG.DB_CONN)
   .then(() => {
      app.listen(CONFIG.PORT, () => {
         console.log(
            "Connected to DB. Server is listening on port " + CONFIG.PORT
         );
      });
   })
   .catch((err: unknown) => {
      errorThrow(err);
   });
