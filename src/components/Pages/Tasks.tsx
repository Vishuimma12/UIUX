import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2,
  AlertCircle,
  Star
} from 'lucide-react';
import Card from '../UI/Card';
import { Task } from '../../types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning workout',
      description: 'Complete 30-minute cardio session',
      completed: true,
      priority: 'medium',
      dueDate: new Date(),
      category: 'Health'
    },
    {
      id: '2',
      title: 'Review presentations',
      description: 'Go through Q3 business review slides',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      category: 'Work'
    },
    {
      id: '3',
      title: 'Grocery shopping',
      description: 'Buy ingredients for weekend dinner party',
      completed: false,
      priority: 'low',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      category: 'Personal'
    }
  ]);
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'Personal'
  });

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      category: newTask.category
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'Personal' });
    setShowAddTask(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return Star;
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
        <p className="text-white/70">
          {pendingTasks.length} pending • {completedTasks.length} completed
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="text-center">
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
          <p className="text-white/60 text-sm">Total</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-cyan-400">{pendingTasks.length}</p>
          <p className="text-white/60 text-sm">Pending</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-400">{completedTasks.length}</p>
          <p className="text-white/60 text-sm">Done</p>
        </Card>
      </motion.div>

      {/* Add Task Button */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          className="w-full backdrop-blur-xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/20 rounded-xl py-4 px-6 text-white font-semibold flex items-center justify-center space-x-2 hover:from-purple-500/40 hover:to-cyan-500/40 transition-all duration-300"
          onClick={() => setShowAddTask(true)}
        >
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Add New Task</h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                  
                  <textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 text-white hover:bg-white/15 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    className="flex-1 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/20 rounded-lg py-3 text-white hover:from-purple-500/40 hover:to-cyan-500/40 transition-all duration-300"
                  >
                    Add Task
                  </button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((task, index) => {
            const PriorityIcon = getPriorityIcon(task.priority);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${task.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 text-white hover:text-purple-400 transition-colors duration-300"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={24} className="text-green-400" />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-white/60' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        <PriorityIcon size={16} className={getPriorityColor(task.priority)} />
                      </div>
                      
                      {task.description && (
                        <p className="text-white/60 text-sm mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-white/50">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{task.dueDate?.toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-1 bg-white/10 rounded-full">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-white/40 hover:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tasks;