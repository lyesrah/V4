import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, ClipboardList, BookOpen, Bell, Users, ChevronRight, UserPlus } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useLanguageStore } from '../../store/languageStore';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotificationStore();
  const { t } = useLanguageStore();

  const menuItems = [
    {
      title: t('sidebar.leads'),
      icon: UserPlus,
      path: '/leads',
      description: t('sidebar.leadsDesc')
    },
    {
      title: t('sidebar.properties'),
      icon: Building2,
      path: '/properties',
      description: t('sidebar.propertiesDesc')
    },
    {
      title: t('sidebar.tasks'),
      icon: ClipboardList,
      path: '/tasks',
      description: t('sidebar.tasksDesc')
    },
    {
      title: t('sidebar.clients'),
      icon: Users,
      path: '/clients',
      description: t('sidebar.clientsDesc')
    },
    {
      title: t('sidebar.notifications'),
      icon: Bell,
      path: '/notifications',
      description: t('sidebar.notificationsDesc'),
      badge: unreadCount
    },
    {
      title: t('sidebar.documentation'),
      icon: BookOpen,
      path: '/docs',
      description: t('sidebar.documentationDesc')
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="space-y-6">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  group cursor-pointer rounded-lg p-3 transition-all
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      isActive 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight className={`
                    w-4 h-4 transition-transform
                    ${isActive 
                      ? 'text-blue-600 dark:text-blue-400 translate-x-1' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:translate-x-1'
                    }
                  `} />
                </div>
                <p className={`
                  mt-1 text-sm pl-8
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}