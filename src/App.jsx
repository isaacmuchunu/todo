import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskBoard from './components/tasks/TaskBoard';
import Calendar from './components/calendar/Calendar';
import Timeline from './components/timeline/Timeline';
import CreateTaskModal from './components/tasks/CreateTaskModal';
import Header from './components/layout/Header';
import { Button } from './components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Plus } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('board');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const views = [
    { id: 'board', label: 'Board', icon: '📋' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'timeline', label: 'Timeline', icon: '⏱' }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100"
          >
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6">
              <Header title="TaskMaster" />
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div className="flex gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-sm">
                  {views.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      className={`
                        px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                        font-medium text-sm
                        ${view === id 
                          ? 'bg-white text-red-600 shadow-lg transform scale-105' 
                          : 'text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <span className="text-lg">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
                
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-lg
                    transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                    flex items-center gap-2 font-medium"
                >
                  <span className="text-lg">✨</span>
                  Create New Task
                </Button>
              </div>
            </div>

            <main className="p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                  className="min-h-[600px]"
                >
                  {view === 'board' && <TaskBoard />}
                  {view === 'calendar' && <Calendar />}
                  {view === 'timeline' && <Timeline />}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <CreateTaskModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #fee2e2',
          }
        }}
      />
    </DndProvider>
  );
};

export default App;