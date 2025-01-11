// Timeline.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config'; 
import { useAuth } from '../../hooks/useAuth';
import TimelineItem from './TimelineItem';

const Timeline = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimelineItems = async () => {
      try {
        const tasksRef = collection(db, 'tasks');
        const q = query(
          tasksRef,
          where('userId', '==', user.uid),
          orderBy('dueDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTimelineItems(items);
      } catch (error) {
        console.error('Error fetching timeline items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTimelineItems();
    }
  }, [user]);

  const filteredItems = timelineItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Project Timeline</h2>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm 
              focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="all">All Items</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400" />
          </div>
        ) : (
          <div className="space-y-8">
            {filteredItems.map((item, index) => (
              <TimelineItem 
                key={item.id} 
                item={item}
                isLast={index === filteredItems.length - 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;

