import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/config'; // Changed from /db to /config to match TaskBoard
import { useAuth } from '../../hooks/useAuth';
import CalendarEvent from './CalendarEvent';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        const eventsRef = collection(db, 'tasks');
        const q = query(
          eventsRef,
          where('userId', '==', user.uid),
          where('dueDate', '>=', Timestamp.fromDate(startOfMonth)),
          where('dueDate', '<=', Timestamp.fromDate(endOfMonth))
        );

        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setEvents(eventsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth, user]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);

  const getEventsForDay = (day) => {
    return events.filter(event => {
      if (!event.dueDate || typeof event.dueDate.toDate !== 'function') {
        return false;
      }
      const eventDate = event.dueDate.toDate();
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {loading ? (
          <div className="col-span-7 h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400" />
          </div>
        ) : (
          <>
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center py-2 text-sm font-semibold text-gray-600"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square bg-gray-50 rounded-lg"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().toDateString() === 
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 rounded-lg ${
                    isToday ? 'bg-red-50 ring-2 ring-red-400' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <CalendarEvent key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;