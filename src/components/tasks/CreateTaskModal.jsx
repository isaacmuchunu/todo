import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const initialFormState = {
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    type: 'deadline',
    dueDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dueDate = new Date(formData.dueDate);
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        status: 'planned',
        dueDate: Timestamp.fromDate(dueDate),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      toast.success('Task created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `
    w-full px-4 py-2.5 rounded-lg border border-red-100
    focus:ring-2 focus:ring-red-400 focus:border-red-400
    bg-white/50 backdrop-blur-sm transition-all duration-200
  `;

  const labelStyle = "block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-xl border border-red-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Create New Task</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelStyle}>
                  <Tag className="w-4 h-4" /> Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputStyle}
                  required
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className={labelStyle}>
                  <AlertCircle className="w-4 h-4" /> Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputStyle} resize-none`}
                  rows="3"
                  placeholder="Enter task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className={inputStyle}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={inputStyle}
                  >
                    <option value="deadline">Deadline</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>
                    <Clock className="w-4 h-4" /> Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputStyle}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>
                    <Calendar className="w-4 h-4" /> Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    px-6 py-2 bg-red-500 text-white rounded-lg
                    hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    transition-all duration-200
                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                    flex items-center gap-2
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;