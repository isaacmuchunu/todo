import { Task, TaskPriority, TaskStatus } from '../types/task';

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };
  return colors[priority];
};

export const getStatusColor = (status: TaskStatus): string => {
  const colors = {
    'todo': 'bg-gray-200',
    'in-progress': 'bg-blue-200',
    'review': 'bg-yellow-200',
    'done': 'bg-green-200'
  };
  return colors[status];
};

export const sortTasks = (tasks: Task[], sortBy: 'priority' | 'dueDate' | 'createdAt'): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
};

export const filterTasks = (
  tasks: Task[],
  filters: {
    status?: TaskStatus[],
    priority?: TaskPriority[],
    assignedTo?: string[],
    tags?: string[]
  }
): Task[] => {
  return tasks.filter(task => {
    const statusMatch = !filters.status || filters.status.includes(task.status);
    const priorityMatch = !filters.priority || filters.priority.includes(task.priority);
    const assigneeMatch = !filters.assignedTo || filters.assignedTo.includes(task.assignedTo);
    const tagsMatch = !filters.tags || filters.tags.some(tag => task.tags.includes(tag));
    
    return statusMatch && priorityMatch && assigneeMatch && tagsMatch;
  });
};
