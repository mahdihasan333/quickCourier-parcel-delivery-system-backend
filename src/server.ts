import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to DB");

    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is listening on port ${envVars.PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect or start server:", error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal: string) => {
  console.log(`${signal} signal received. Closing server...`);
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});
