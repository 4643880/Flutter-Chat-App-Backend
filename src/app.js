import express from "express";
const app = express();
import cors from "cors";

app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // will allow
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

export { app };
