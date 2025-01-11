export const TASK_STATUSES = ['planned', 'in-progress', 'completed'] as const;

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export const TASK_CATEGORIES = [
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'personal', label: 'Personal', icon: '🏠' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
  { id: 'health', label: 'Health', icon: '🏥' }
] as const;

export const COLUMNS = {
  planned: {
    title: 'Planned',
    icon: '📋',
    color: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100/80',
    borderColor: 'border-gray-200'
  },
  'in-progress': {
    title: 'In Progress',
    icon: '🔄',
    color: 'bg-red-50',
    hoverColor: 'hover:bg-red-100/80',
    borderColor: 'border-red-200'
  },
  completed: {
    title: 'Completed',
    icon: '✅',
    color: 'bg-green-50',
    hoverColor: 'hover:bg-green-100/80',
    borderColor: 'border-green-200'
  }
} as const;

export const PRIORITY_CONFIG = {
  high: {
    color: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    label: 'High Priority',
    icon: '🔴'
  },
  medium: {
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    label: 'Medium Priority',
    icon: '🟡'
  },
  low: {
    color: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    label: 'Low Priority',
    icon: '🟢'
  }
} as const;

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  api: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
} as const;

export const VIEWS = [
  { id: 'board', label: 'Board', icon: '📋' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'timeline', label: 'Timeline', icon: '⏱' }
] as const;