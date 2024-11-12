import React from 'react';
import { Building2, Users, ClipboardList, Clock, Bell, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePropertyStore } from '../store/propertyStore';
import { useClientStore } from '../store/clientStore';
import { useTaskStore } from '../store/taskStore';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { format, isToday, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
  path?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { properties } = usePropertyStore();
  const { getClientCount } = useClientStore();
  const { getTodaysTasks, getInProgressTasks } = useTaskStore();
  const { t } = useLanguageStore();

  const firstName = user?.email?.split('@')[0] || 'User';
  const todaysTasks = getTodaysTasks();
  const inProgressTasks = getInProgressTasks();

  const stats: StatCard[] = [
    {
      title: t('dashboard.properties'),
      value: properties.length,
      icon: <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      path: '/properties'
    },
    {
      title: t('dashboard.totalClients'),
      value: getClientCount(),
      icon: <Users className="w-6 h-6 text-green-600 dark:text-green-400" />,
      path: '/clients'
    },
    {
      title: t('dashboard.todaysTasks'),
      value: todaysTasks.length,
      icon: <ClipboardList className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      path: '/tasks'
    },
    {
      title: t('dashboard.tasksInProgress'),
      value: inProgressTasks.length,
      icon: <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      path: '/tasks'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'normal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.greeting')}, {firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
            <Mail className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            onClick={() => stat.path && navigate(stat.path)}
            className={cn(
              "bg-white dark:bg-gray-800 p-6 cursor-pointer hover:shadow-md transition-shadow",
              "transform hover:scale-[1.02] transition-transform"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{stat.icon}</div>
              {stat.change && (
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{stat.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.todaysTasks')}
                </h2>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/tasks')}
                className="text-sm"
              >
                {t('dashboard.viewAll')}
              </Button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isPast(new Date(task.dueDate)) ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(task.dueDate), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('dashboard.noTasks')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('dashboard.recentActivity')}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {[
              { id: '1', message: 'New maintenance request from Apt 15A', time: '10 mins ago' },
              { id: '2', message: 'Lease signed by new tenant', time: '1 hour ago' },
              { id: '3', message: 'Rent payment received', time: '2 hours ago' },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">{activity.message}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}