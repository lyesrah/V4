import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationItem } from '@/components/notifications/NotificationItem';

export default function Notifications() {
  const { notifications, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your latest notifications</p>
      </div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No notifications yet</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              title={notification.title}
              message={notification.message}
              timestamp={notification.timestamp}
              isRead={notification.isRead}
            />
          ))
        )}
      </div>
    </div>
  );
}