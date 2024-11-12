import React from 'react';
import { Task } from '@/store/taskStore';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface TaskMetricsProps {
  tasks: Task[];
}

export default function TaskMetrics({ tasks }: TaskMetricsProps) {
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const getOverdueTasks = () => {
    return tasks.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < new Date()
    ).length;
  };

  const getCompletionRate = () => {
    const completed = getTasksByStatus('completed');
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  };

  const metrics = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'In Progress',
      value: getTasksByStatus('in_progress'),
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      title: 'Blocked',
      value: getTasksByStatus('blocked'),
      icon: Ban,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      title: 'Urgent Tasks',
      value: getTasksByPriority('urgent'),
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      title: 'Completion Rate',
      value: `${getCompletionRate()}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Overdue Tasks',
      value: getOverdueTasks(),
      icon: TrendingDown,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}