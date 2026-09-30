export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export interface Notification {
  recipientId: string;
  message: string;
  subject?: string;
}

export interface NotificationPort {
  sendNotification(notification: Notification): Promise<void>;
}
