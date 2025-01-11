
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  tags: string[];
  attachments?: string[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
}

export interface TaskBoard {
  columns: {
    [key in TaskStatus]: Task[];
  };
}