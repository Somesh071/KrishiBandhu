import { io } from 'socket.io-client';

// Always use current domain (works in K8s + Ingress + HTTPS)
const SOCKET_URL = window.location.origin;

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  /**
   * Connect to the socket server
   * @param {string} token - JWT access token
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.isConnected = true;
        return resolve(this.socket);
      }

      // Disconnect existing socket if any
      if (this.socket) {
        this.socket.disconnect();
      }

      console.log("🔌 Connecting to:", SOCKET_URL);

      this.socket = io(SOCKET_URL, {
        path: "/socket.io", // 🔥 IMPORTANT for nginx routing
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      const timeout = setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error("Connection timeout"));
        }
      }, 15000);

      this.socket.on("connect", () => {
        clearTimeout(timeout);
        console.log("✅ Connected:", this.socket.id);
        this.isConnected = true;
        resolve(this.socket);
      });

      this.socket.on("connect_error", (err) => {
        clearTimeout(timeout);
        console.error("❌ Connection error:", err.message);
        this.isConnected = false;
        reject(err);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Disconnected:", reason);
        this.isConnected = false;
      });

      this.socket.on("reconnect", (attempt) => {
        console.log("🔁 Reconnected after", attempt, "attempts");
        this.isConnected = true;
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  startConversation() {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Socket not connected"));
      }

      this.socket.emit("conversation:start", (res) => {
        res.success ? resolve(res) : reject(new Error(res.error));
      });
    });
  }

  joinConversation(conversationId) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Socket not connected"));
      }

      this.socket.emit("conversation:join", { conversationId }, (res) => {
        res.success ? resolve(res) : reject(new Error(res.error));
      });
    });
  }

  sendMessage(conversationId, message) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Socket not connected"));
      }

      console.log("📤 Sending:", { conversationId, message });

      const timeout = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, 30000);

      this.socket.emit(
        "message:send",
        { conversationId, message },
        (res) => {
          clearTimeout(timeout);
          console.log("📥 Response:", res);

          res.success
            ? resolve(res)
            : reject(new Error(res.error || "Failed"));
        }
      );
    });
  }

  endConversation(conversationId) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error("Socket not connected"));
      }

      this.socket.emit("conversation:end", { conversationId }, (res) => {
        res.success ? resolve(res) : reject(new Error(res.error));
      });
    });
  }

  onProcessing(cb) {
    this.socket?.on("message:processing", cb);
  }

  onMessageReceived(cb) {
    this.socket?.on("message:received", cb);
  }

  off(event) {
    this.socket?.off(event);
  }
}

export default new SocketService();
