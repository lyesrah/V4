import React, { useState, useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { usePropertyStore } from '@/store/propertyStore';
import { 
  LayoutGrid, 
  List as ListIcon, 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  Search,
  Menu
} from 'lucide-react';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskList from '@/components/tasks/TaskList';
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import TaskMetrics from '@/components/tasks/TaskMetrics';
import { Task } from '@/store/taskStore';
import { TaskViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Tasks() {
  const [viewMode, setViewMode] = useState<TaskViewMode>('board');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const { tasks } = useTaskStore();
  const { properties } = usePropertyStore();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = search.toLowerCase().trim() === '' ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter.length === 0 ||
        statusFilter.includes(task.status);

      const matchesPriority = priorityFilter.length === 0 ||
        priorityFilter.includes(task.priority);

      const matchesProperty = propertyFilter.length === 0 ||
        propertyFilter.includes(task.propertyId);

      const matchesDate = (!dateRange.from || new Date(task.dueDate) >= dateRange.from) &&
        (!dateRange.to || new Date(task.dueDate) <= dateRange.to);

      return matchesSearch && matchesStatus && matchesPriority && matchesProperty && matchesDate;
    });
  }, [tasks, search, statusFilter, priorityFilter, propertyFilter, dateRange]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter([]);
    setPriorityFilter([]);
    setPropertyFilter([]);
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>View Options</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">View Mode</span>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={viewMode === 'board' ? 'default' : 'outline'}
                      onClick={() => setViewMode('board')}
                      className="justify-start"
                    >
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Board
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      onClick={() => setViewMode('list')}
                      className="justify-start"
                    >
                      <ListIcon className="mr-2 h-4 w-4" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === 'timeline' ? 'default' : 'outline'}
                      onClick={() => setViewMode('timeline')}
                      className="justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop View Mode Toggle */}
          <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              className="flex items-center"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Board
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center"
            >
              <ListIcon className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              className="flex items-center"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Task</span>
          </Button>
        </div>
      </div>

      {/* Task Metrics */}
      <div className="hidden md:block">
        <TaskMetrics tasks={filteredTasks} />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(statusFilter.length > 0 || priorityFilter.length > 0 || propertyFilter.length > 0) && (
                <span className="ml-2 bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {statusFilter.length + priorityFilter.length + propertyFilter.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Task Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <TaskFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                propertyFilter={propertyFilter}
                onPropertyFilterChange={setPropertyFilter}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                properties={properties}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Task Views */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'board' && (
          <TaskBoard
            tasks={filteredTasks}
            properties={properties}
            onTaskClick={handleTaskClick}
          />
        )}
        {viewMode === 'list' && (
          <TaskList
            tasks={filteredTasks}
            properties={properties}
            onTaskClick={handleTaskClick}
          />
        )}
        {viewMode === 'timeline' && (
          <TaskCalendarView
            tasks={filteredTasks}
            properties={properties}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        properties={properties}
      />
      
      {selectedTask && (
        <EditTaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          properties={properties}
        />
      )}
    </div>
  );
}