import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { 
  createDocument,
  updateDocument,
  deleteDocument,
  getDocuments
} from '../lib/firebase/db';

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const conditions = [
        { field: 'assignedTo', operator: '==', value: userId }
      ];
      const fetchedTasks = await getDocuments('tasks', conditions, 'createdAt', 'desc');
      setTasks(fetchedTasks as Task[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const taskId = await createDocument('tasks', taskData);
      await fetchTasks();
      return taskId;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      await updateDocument('tasks', taskId, taskData);
      await fetchTasks();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDocument('tasks', taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    refreshTasks: fetchTasks
  };
};
