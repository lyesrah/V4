import React from 'react';
import { Task } from '@/store/taskStore';
import { Property } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Clock } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
  properties: Property[];
}

export default function TaskTimeline({ tasks, properties }: TaskTimelineProps) {
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const groupedTasks = sortedTasks.reduce((groups, task) => {
    const date = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  return (
    <div className="p-6">
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <div key={date} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>

          <div className="ml-3 border-l-2 border-gray-200 dark:border-gray-700 pl-8 space-y-6">
            {tasks.map((task) => {
              const property = properties.find(p => p.id === task.propertyId);
              const isOverdue = new Date(task.dueDate) < new Date();

              return (
                <Card
                  key={task.id}
                  className={`relative ${
                    isOverdue ? 'border-red-300 dark:border-red-700' : ''
                  }`}
                >
                  <div className="absolute -left-[calc(2rem+1px)] top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {task.status}
                      </Badge>
                      <Badge variant={task.priority}>
                        {task.priority}
                      </Badge>
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {task.title}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      {property && (
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          <span>{property.name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {format(new Date(task.dueDate), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}