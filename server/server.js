import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();