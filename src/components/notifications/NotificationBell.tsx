import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative"
      title="Notifications"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}