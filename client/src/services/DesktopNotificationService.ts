import { AlertDTO } from "../models/alerts/AlertDTO";
import { AlertSeverity } from "../enums/AlertSeverity";

export class DesktopNotificationService {
  private permission: NotificationPermission = "default";

  constructor() {
    this.permission = Notification.permission;
  }

  /**
   * Request permission for desktop notifications
   * Should be called on app startup or user action
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

    if (this.permission === "denied") {
      console.warn("Notification permission denied by user");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }

  /**
   * Show desktop notification for new alert
   */
  showAlertNotification(alert: AlertDTO, onClick?: () => void): void {
    if (!this.canShowNotifications()) {
      return;
    }

    // Only show notifications for HIGH and CRITICAL alerts
    if (
      alert.severity !== AlertSeverity.HIGH &&
      alert.severity !== AlertSeverity.CRITICAL
    ) {
      return;
    }

    const options: NotificationOptions = {
      body: alert.description,
      icon: this.getAlertIcon(alert.severity),
      badge: this.getAlertIcon(alert.severity),
      tag: `alert-${alert.id}`, // Prevent duplicate notifications
      requireInteraction: alert.severity === AlertSeverity.CRITICAL,
      data: {
        alertId: alert.id,
        url:
          window.location.origin +
          "/mainLayout?tab=alerts&alertId=" +
          alert.id
      }
    };

    try {
      const notification = new Notification(
        `${alert.severity} Alert: ${alert.title}`,
        options
      );

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();

        if (onClick) {
          onClick();
        } else if (notification.data?.url) {
          window.location.href = notification.data.url;
        }

        notification.close();
      };

      // Auto-close after 10s for non-critical alerts
      if (alert.severity !== AlertSeverity.CRITICAL) {
        setTimeout(() => notification.close(), 10000);
      }
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }

  /**
   * Show bulk notification for multiple alerts
   */
  showBulkAlertNotification(count: number, criticalCount: number): void {
    if (!this.canShowNotifications()) {
      return;
    }

    const options: NotificationOptions = {
      body: `${criticalCount} critical, ${count - criticalCount} other alerts`,
      icon: "/alert-icon.png",
      badge: "/alert-badge.png",
      tag: "bulk-alerts",
      requireInteraction: criticalCount > 0,
      data: {
        url: window.location.origin + "/mainLayout?tab=alerts"
      }
    };

    try {
      const notification = new Notification(
        `⚠️ ${count} New Security Alerts`,
        options
      );

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        window.location.href = notification.data?.url;
        notification.close();
      };

      setTimeout(() => notification.close(), 15000);
    } catch (error) {
      console.error("Failed to show bulk notification:", error);
    }
  }

  /**
   * Check if notifications can be shown
   */
  canShowNotifications(): boolean {
    return "Notification" in window && this.permission === "granted";
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  /**
   * Get alert icon based on severity
   */
  private getAlertIcon(severity: AlertSeverity): string {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return "/icons/alert-critical.png";
      case AlertSeverity.HIGH:
        return "/icons/alert-high.png";
      case AlertSeverity.MEDIUM:
        return "/icons/alert-medium.png";
      case AlertSeverity.LOW:
        return "/icons/alert-low.png";
      default:
        return "/icons/alert-default.png";
    }
  }

  /**
   * Close notifications by tag (not supported in browser API)
   */
  closeNotificationsByTag(tag: string): void {
    console.log(`Closing notifications with tag: ${tag}`);
  }
}
