import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Filter, ArrowUpDown } from 'lucide-react';
import TaskColumn from './TaskColumn';
import { db } from '../../lib/firebase/config';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { id: 'planned', title: 'Planned', color: 'bg-blue-50/80', accentColor: 'bg-blue-500', icon: '📋' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-50/80', accentColor: 'bg-yellow-500', icon: '⚡' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50/80', accentColor: 'bg-green-500', icon: '✅' }
  ];

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const moveTask = async (taskId, newStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  };

  const getFilteredTasks = (status) => {
    return tasks
      .filter(task => task.status === status)
      .filter(task => {
        if (filter === 'all') return true;
        if (filter === 'high') return task.priority === 'high';
        if (filter === 'overdue') {
          return new Date(task.dueDate) < new Date() && task.status !== 'completed';
        }
        return task.category === filter;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        }
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
  };

  const columnAnimations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, staggerChildren: 0.1 }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6 p-6">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-white/80 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="high">High Priority</option>
                <option value="overdue">Overdue</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-white/80 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                Total: {tasks.length}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md">
                In Progress: {tasks.filter(t => t.status === 'in-progress').length}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                Completed: {tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={columnAnimations}
          initial="initial"
          animate="animate"
        >
          {columns.map(({ id, title, color, accentColor, icon }) => (
            <TaskColumn
              key={id}
              id={id}
              title={title}
              icon={icon}
              color={color}
              accentColor={accentColor}
              tasks={getFilteredTasks(id)}
              onMoveTask={moveTask}
              isLoading={isLoading}
            />
          ))}
        </motion.div>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;