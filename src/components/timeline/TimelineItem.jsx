// TimelineItem.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TimelineItem = ({ item, isLast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative pl-16"
    >
      <div className={`
        absolute left-6 w-4 h-4 rounded-full border-2 border-white
        ${item.status === 'completed' ? 'bg-green-500' : 
          item.status === 'in-progress' ? 'bg-red-500' : 'bg-gray-500'}
      `} />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 
        hover:border-red-200 transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <span className="px-3 py-1 rounded-full text-xs font-medium 
            bg-red-100 text-red-700"
          >
            {item.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">{item.description}</p>
        
        <div className="text-sm text-gray-500">
          {new Date(item.dueDate?.toDate()).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineItem;