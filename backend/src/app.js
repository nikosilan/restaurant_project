import cors from "cors";
import express from "express";
import api from "./api/index.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

// The React frontend and API run on different local ports during development,
// so the browser needs CORS permission to send requests from the frontend to the backend.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", api);
app.use(errorHandler);

export default app;
