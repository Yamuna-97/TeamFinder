import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If user is not logged in
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    // Connect to backend Socket.IO server
    const s = io("http://localhost:5000", {
      auth: {
        token,
      },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = s;
    setSocket(s);

    // Connection Events
    s.on("connect", () => {
      console.log("✅ Socket Connected:", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("❌ Socket Disconnected:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("🚨 Socket Connection Error:", err.message);
    });

    // Presence Events
    const handleUsersStatus = ({ online }) => {
      setOnlineUsers(Array.isArray(online) ? online : []);
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) =>
        prev.includes(String(userId))
          ? prev
          : [...prev, String(userId)]
      );
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers((prev) =>
        prev.filter((id) => id !== String(userId))
      );
    };

    s.on("users:status", handleUsersStatus);
    s.on("user:online", handleUserOnline);
    s.on("user:offline", handleUserOffline);

    // Cleanup
    return () => {
      s.off("users:status", handleUsersStatus);
      s.off("user:online", handleUserOnline);
      s.off("user:offline", handleUserOffline);

      s.disconnect();

      socketRef.current = null;
      setSocket(null);
      setOnlineUsers([]);
    };
  }, []);

  const value = useMemo(
    () => ({
      socket,
      onlineUsers,
    }),
    [socket, onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
};

export default SocketContext;