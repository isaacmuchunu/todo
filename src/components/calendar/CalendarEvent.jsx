import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Flag, Calendar as CalIcon } from 'lucide-react';

const CalendarEvent = ({ event }) => {
  const typeStyles = {
    meeting: {
      bg: 'bg-red-100/80 hover:bg-red-100',
      text: 'text-red-700',
      icon: <Clock className="w-3 h-3" />,
      border: 'border-red-200'
    },
    deadline: {
      bg: 'bg-rose-100/80 hover:bg-rose-100',
      text: 'text-rose-700',
      icon: <Flag className="w-3 h-3" />,
      border: 'border-rose-200'
    },
    default: {
      bg: 'bg-gray-100/80 hover:bg-gray-100',
      text: 'text-gray-700',
      icon: <CalIcon className="w-3 h-3" />,
      border: 'border-gray-200'
    }
  };

  const style = typeStyles[event.type] || typeStyles.default;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${style.bg} ${style.text}
        cursor-pointer rounded-md border ${style.border}
        transition-all duration-200 backdrop-blur-sm
        p-1.5 text-xs font-medium shadow-sm
        flex items-center gap-1.5
      `}
    >
      {style.icon}
      <span className="truncate">{event.title}</span>
    </motion.div>
  );
};

export default CalendarEvent;