import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/generateTokens.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Auth token required"));
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user._id}`);

    socket.join(`user:${socket.user._id}`);
    if (socket.user.workspace) {
      socket.join(`workspace:${socket.user.workspace}`);
    }

    socket.on("ticket:join", (ticketId) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on("ticket:leave", (ticketId) => {
      socket.leave(`ticket:${ticketId}`);
    });

    socket.on("typing:start", ({ ticketId }) => {
      socket.to(`ticket:${ticketId}`).emit("typing:start", {
        userId: socket.user._id,
      });
    });

    socket.on("typing:stop", ({ ticketId }) => {
      socket.to(`ticket:${ticketId}`).emit("typing:stop", {
        userId: socket.user._id,
      });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.user._id}`);
    });
  });

  // Make io available in controllers
  const app = server._events.request;
  if (app) app.set("io", io);

  return io;
};