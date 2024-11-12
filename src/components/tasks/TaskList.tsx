import React from 'react';
import { Clock, Check } from 'lucide-react';
import { Task } from '../../store/taskStore';
import { Property } from '../../types';

interface TaskListProps {
  tasks: Task[];
  properties: Property[];
}

export default function TaskList({ tasks, properties }: TaskListProps) {
  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 transition ${
              task.status === 'completed' ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {getPropertyName(task.propertyId)}
                    </p>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(task.dueDate)}
                  </span>
                </div>
                {task.status === 'completed' && (
                  <div className="mt-2 flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500">
            Create a new task to get started
          </p>
        </div>
      )}
    </div>
  );
}