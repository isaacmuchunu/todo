import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import { db } from '../../lib/firebase/config';

const TaskColumn = ({ id, title, color, accentColor, icon, tasks, isLoading }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateError = (error) => {
    console.error('Error updating task:', error);
    
    toast.error('Failed to move task', {
      description: 'There was an error updating the task status. Please try again.',
      action: {
        label: 'Retry',
        onClick: () => handleRetry(error.taskData),
      },
    });

    setError({
      message: error.message,
      taskData: error.taskData
    });
  };

  const handleRetry = async (taskData) => {
    setError(null);
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, 'tasks', taskData.id), {
        status: id,
        updatedAt: new Date()
      });
      
      toast.success('Task moved successfully', {
        description: `Task moved to ${title}`,
      });
    } catch (error) {
      handleUpdateError({ ...error, taskData });
    } finally {
      setIsUpdating(false);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: async (item) => {
      if (item.status !== id) {
        try {
          setIsUpdating(true);
          setError(null);
          
          const toastId = toast.loading('Moving task...', {
            description: `Moving task to ${title}`,
          });
          
          await updateDoc(doc(db, 'tasks', item.id), {
            status: id,
            updatedAt: new Date()
          });
          
          toast.dismiss(toastId);
          toast.success('Task moved successfully', {
            description: `Task moved to ${title}`,
          });
        } catch (error) {
          handleUpdateError({ ...error, taskData: item });
        } finally {
          setIsUpdating(false);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: isOver ? 1.02 : 1 }
  };

  const taskVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <motion.div
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.2 }}
      ref={drop}
      className={`
        ${color} rounded-xl p-4
        ${isOver ? `ring-2 ring-offset-2 ring-${accentColor}` : ''}
        ${isUpdating ? 'opacity-75' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert 
              variant="destructive"
              className="mb-4 border border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Moving Task</AlertTitle>
              <AlertDescription className="flex items-center justify-between mt-2">
                <span>{error.message}</span>
                <button
                  onClick={() => handleRetry(error.taskData)}
                  className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/20 
                            text-red-900 dark:text-red-200 rounded-md hover:bg-red-200 
                            dark:hover:bg-red-900/40 transition-colors"
                >
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed rounded-lg p-4 text-gray-400"
          >
            <Plus className="w-6 h-6 mb-2" />
            <p className="text-sm text-center">Drop tasks here</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <TaskCard 
                  task={task} 
                  disabled={isUpdating}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

TaskColumn.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool
};

TaskColumn.defaultProps = {
  isLoading: false
};

export default TaskColumn;