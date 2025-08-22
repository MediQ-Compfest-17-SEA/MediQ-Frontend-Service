
import { io, Socket } from "socket.io-client";

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socketRef: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private callbacks: Record<string, Function[]> = {};

  public isConnected = false;

  private constructor() {}

  public static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (this.socketRef) return;

    this.socketRef = io(process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000");

    this.socketRef.on("connect", () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.executeCallback("connect", null);
    });

    this.socketRef.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, 2000);
      }
    });

    this.socketRef.onAny((event, data) => {
      this.executeCallback(event, data);
    });
  }

  disconnect() {
    if (this.socketRef) {
      this.socketRef.disconnect();
      this.socketRef = null;
      this.isConnected = false;
    }
  }

  emit(event: string, data: any) {
    if (this.socketRef && this.isConnected) {
      this.socketRef.emit(event, data);
    }
  }

  addCallbacks(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  removeCallbacks(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  private executeCallback(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }
}

export default WebSocketService.getInstance();
