import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '@/store/taskStore';
import { Property } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { Clock, AlertTriangle, CheckCircle2, Ban } from 'lucide-react';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  properties: Property[];
  onTaskClick: (task: Task) => void;
}

const columns = [
  { id: 'not_started', title: 'To Do', icon: Clock },
  { id: 'in_progress', title: 'In Progress', icon: AlertTriangle },
  { id: 'completed', title: 'Completed', icon: CheckCircle2 },
  { id: 'blocked', title: 'Blocked', icon: Ban },
];

export default function TaskBoard({ tasks, properties, onTaskClick }: TaskBoardProps) {
  const { updateTaskStatus } = useTaskStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    updateTaskStatus(draggableId, destination.droppableId as Task['status']);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-3 p-1 min-w-min">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            const Icon = column.icon;

            return (
              <div
                key={column.id}
                className="flex-shrink-0 w-[280px] max-w-[280px] flex flex-col"
              >
                <div className="flex items-center space-x-2 mb-3 px-2">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({columnTasks.length})
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto px-1 space-y-3 min-h-[100px]"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                              onClick={() => onTaskClick(task)}
                              className="rounded-lg hover:ring-2 hover:ring-blue-500 transition-all touch-none"
                            >
                              <TaskCard
                                task={task}
                                property={properties.find(p => p.id === task.propertyId)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}