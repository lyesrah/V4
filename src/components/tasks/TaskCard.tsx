import React from 'react';
import { Task } from '@/store/taskStore';
import { Property } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  property?: Property;
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  normal: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export default function TaskCard({ task, property }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs whitespace-nowrap`}>
            {task.priority}
          </Badge>
          {isOverdue && (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
          {task.title}
        </h4>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="space-y-1.5">
          {property && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Building2 className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="text-xs truncate">{property.name}</span>
            </div>
          )}

          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <span className="text-xs truncate">
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}