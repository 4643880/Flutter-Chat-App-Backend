import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middlewares/error_handler.middleware.js";
import methodNotAllowed from "./middlewares/method_not_allowed.middleware.js";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRoutes);

app.use(errorHandler); // Global error handler must be after the routes
// Add at the end of all routes to catch-all  unsupported routes or methods e.g user hit post method but api expects put method
app.use(methodNotAllowed);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ welcomeMessage: "Welcome to Rabbit API." });
});

export { app };
