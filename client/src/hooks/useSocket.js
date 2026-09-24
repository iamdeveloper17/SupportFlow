import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axios.js";

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Already connected
      if (socketInstance?.connected) {
        socketRef.current = socketInstance;
        setSocket(socketInstance);
        return;
      }

      // Disconnect stale socket
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }

      try {
        const res = await api.post("/auth/refresh");
        const token = res.data.data.accessToken;

        socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
          auth: { token },
          withCredentials: true,
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);
      } catch {
        /* not logged in — skip */
      }
    };

    init();

    return () => {
      // Don't disconnect on unmount (keep across pages)
    };
  }, []);

  return socket;
};