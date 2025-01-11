import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const TASKS_COLLECTION = 'tasks';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}) => {
    try {
      let tasksQuery = collection(db, TASKS_COLLECTION);
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        tasksQuery = query(tasksQuery, where('status', '==', filters.status));
      }
      if (filters.priority && filters.priority !== 'all') {
        tasksQuery = query(tasksQuery, where('priority', '==', filters.priority));
      }
      
      // Always sort by creation date
      tasksQuery = query(tasksQuery, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return {
        id: docRef.id,
        ...taskData
      };
    } catch (error) {
      throw new Error('Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, id);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return {
        id,
        ...updates
      };
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, id);
      await deleteDoc(taskRef);
      return id;
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }
);