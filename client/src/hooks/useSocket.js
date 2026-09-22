import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api/axios.js";

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (socketInstance) {
        socketRef.current = socketInstance;
        return;
      }
      try {
        // refresh to get fresh cookie
        const res = await api.post("/auth/refresh");
        const token = res.data.data.accessToken;
        socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
          auth: { token },
          withCredentials: true,
        });
        socketRef.current = socketInstance;
      } catch {
        /* not logged in */
      }
    };
    init();

    return () => {
      // keep alive across pages
    };
  }, []);

  return socketRef.current;
};