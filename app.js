import "dotenv/config"
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import routes from "./routes.js";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/assets", express.static(path.join(process.cwd(), "public")));
app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
    ],
  }),
);

// Routes
app.use("/", routes);

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
