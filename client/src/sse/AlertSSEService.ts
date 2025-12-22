import { AlertDTO } from "../models/alerts/AlertDTO";

export type SSEEventType = "NEW_ALERT" | "ALERT_UPDATED";

export interface SSEMessage {
  type: SSEEventType;
  data: AlertDTO;
  updateType?: string;
  timestamp: string;
}

export class AlertSSEService {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;

  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000; // ms

  private onNewAlertCallback?: (alert: AlertDTO) => void;
  private onAlertUpdateCallback?: (alert: AlertDTO, updateType: string) => void;
  private onConnectionStatusCallback?: (connected: boolean) => void;
  private onErrorCallback?: (error: string) => void;

  constructor(private readonly gatewayUrl: string) {}

  connect() {
    if (this.eventSource) {
      console.warn("SSE connection already exists");
      return;
    }

    const url = `${this.gatewayUrl}/siem/alerts/notifications/stream`;

    try {
      this.eventSource = new EventSource(url, {
        withCredentials: true, 
      });

      this.eventSource.onopen = () => {
        console.log("SSE connection established");
        this.reconnectAttempts = 0;
        this.onConnectionStatusCallback?.(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        this.onConnectionStatusCallback?.(false);
        this.handleReconnect();
      };
    } catch (err) {
      console.error("Failed to create SSE connection:", err);
      this.onErrorCallback?.("Failed to establish SSE connection");
    }
  }

  private handleMessage(message: SSEMessage) {
    console.log(`📨 SSE message received: ${message.type}`, message);

    switch (message.type) {
      case "NEW_ALERT":
        this.onNewAlertCallback?.(message.data);
        break;

      case "ALERT_UPDATED":
        this.onAlertUpdateCallback?.(
          message.data,
          message.updateType ?? "UNKNOWN"
        );
        break;

      default:
        console.warn("Unknown SSE message type:", message.type);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max SSE reconnection attempts reached");
      this.onErrorCallback?.("Connection lost. Please refresh the page.");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting SSE reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.disconnect();

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log("🔌 SSE connection closed");
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.onConnectionStatusCallback?.(false);
  }

  // Callback registrations
  onNewAlert(callback: (alert: AlertDTO) => void) {
    this.onNewAlertCallback = callback;
  }

  onAlertUpdate(callback: (alert: AlertDTO, updateType: string) => void) {
    this.onAlertUpdateCallback = callback;
  }

  onConnectionStatus(callback: (connected: boolean) => void) {
    this.onConnectionStatusCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  isConnected(): boolean {
    return (
      this.eventSource !== null &&
      this.eventSource.readyState === EventSource.OPEN
    );
  }
}
