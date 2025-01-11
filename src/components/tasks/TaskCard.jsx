import { useDrag } from 'react-dnd';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Tag, AlertCircle, Calendar } from 'lucide-react';

const priorityConfig = {
  high: {
    color: 'bg-red-100 text-red-800',
    hoverColor: 'hover:bg-red-200',
    icon: '🔴'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    hoverColor: 'hover:bg-yellow-200',
    icon: '🟡'
  },
  low: {
    color: 'bg-green-100 text-green-800',
    hoverColor: 'hover:bg-green-200',
    icon: '🟢'
  }
};

const categoryConfig = {
  work: { icon: '💼', color: 'text-blue-600' },
  personal: { icon: '👤', color: 'text-purple-600' }
};

const TaskCard = ({ task, disabled }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !disabled
  });

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const priority = priorityConfig[task.priority];
  const category = categoryConfig[task.category];

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border border-gray-100
        ${isDragging ? 'opacity-50' : ''}
        ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-grab hover:shadow-md'}
        transition-all duration-200
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          {priority.icon} {task.title}
        </h4>
        <span className={`text-xs px-2 py-1 rounded-full ${priority.color} ${priority.hoverColor}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Tag className="w-3 h-3" />
          <span className={`flex items-center gap-1 ${category.color}`}>
            {category.icon} {task.category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3 h-3 text-gray-500" />
          <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>

        {task.type === 'meeting' && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Meeting</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;