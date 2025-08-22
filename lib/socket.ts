import io from "socket.io-client";

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socketRef: SocketIOClient.Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private callbacks: Record<string, Function[]> = {};
  private token: string | null = null;

  public isConnected = false;

  private constructor() {}

  public static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  setToken(token: string) {
    this.token = token;
  }

  connect() {
    if (this.socketRef) return;

    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL || "https://mediq-api-gateway.craftthingy.com/api/socket";
    
    // Initialize socket with auth token if available
    const socketOptions: any = {
      transports: ['websocket'],
      upgrade: true,
    };

    if (this.token) {
      socketOptions.auth = {
        token: this.token
      };
    }

    this.socketRef = io(socketUrl, socketOptions);

    this.socketRef.on("connect", () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.executeCallback("connect", null);
    });

    this.socketRef.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
      this.executeCallback("disconnect", null);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          this.connect();
        }, 2000 * this.reconnectAttempts); // Exponential backoff
      }
    });

    this.socketRef.on("error", (error: any) => {
      console.error("WebSocket error:", error);
      this.executeCallback("error", error);
    });

    // Listen for queue updates
    this.socketRef.on("queue_update", (data: any) => {
      console.log("Queue update received:", data);
      this.executeCallback("queue_update", data);
    });

    // Listen for queue ready notifications
    this.socketRef.on("queue_ready", (data: any) => {
      console.log("Queue ready notification:", data);
      this.executeCallback("queue_ready", data);
    });

    // Listen for queue almost ready notifications
    this.socketRef.on("queue_almost_ready", (data: any) => {
      console.log("Queue almost ready notification:", data);
      this.executeCallback("queue_almost_ready", data);
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
      console.log(`Emitting ${event}:`, data);
      this.socketRef.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected`);
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

  // Method to subscribe to notifications
  subscribeToNotifications(userId: string, institutionId: string, types: string[] = ['queue_ready', 'queue_almost_ready', 'queue_update']) {
    this.emit('subscribe_notifications', {
      userId,
      institutionId,
      types
    });
  }

  // Method to unsubscribe from notifications
  unsubscribeFromNotifications(userId: string, institutionId: string) {
    this.emit('unsubscribe_notifications', {
      userId,
      institutionId
    });
  }
}

export default WebSocketService.getInstance();