import "dotenv/config"
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import routes from "./routes.js";

const app = express();

// If we are testing, don't use morgan
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Add public assets folder so images can be loaded by the frontend
app.use("/assets", express.static(path.join(process.cwd(), "public")));
// Add json
app.use(express.json());

// Allow the frontend to access the urls
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
    ],
  }),
);

// Routes
app.use("/", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: "This content does not exist.",
  });
});

// Error Handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (status !== 404) {
    console.error(err);
  }

  res.status(status).json({
    error: status,
    message: err.message || "Something went wrong.",
  });
});

export default app;
