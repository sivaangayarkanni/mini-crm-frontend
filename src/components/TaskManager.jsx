import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  X,
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'follow_up',
    relatedTo: '',
    completed: false
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('crm_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('crm_tasks', JSON.stringify(updatedTasks));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      ...formData,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map(task => task.id === editingTask.id ? newTask : task);
    } else {
      updatedTasks = [...tasks, newTask];
    }

    saveTasks(updatedTasks);
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'follow_up',
      relatedTo: '',
      completed: false
    });
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
    }
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed) ||
      (filter === task.priority) ||
      (filter === task.category);
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--info)';
      default: return 'var(--gray-500)';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'follow_up': return <Calendar size={16} />;
      case 'meeting': return <Clock size={16} />;
      case 'call': return <Calendar size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  return (
    <div className="task-manager">
      <div className="task-header">
        <h3>Task Manager</h3>
        <button className="btn btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="task-controls">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
          <option value="follow_up">Follow-ups</option>
          <option value="meeting">Meetings</option>
          <option value="call">Calls</option>
        </select>
      </div>

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h4>No tasks found</h4>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <div className="task-main">
                  <button
                    className="task-checkbox"
                    onClick={() => toggleComplete(task.id)}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="task-category">
                        {getCategoryIcon(task.category)}
                        {task.category.replace('_', ' ')}
                      </span>
                      <span className="task-due">
                        <Clock size={14} />
                        {new Date(task.dueDate).toLocaleDateString('en-IN')}
                      </span>
                      <span 
                        className="task-priority"
                        style={{ color: getPriorityColor(task.priority) }}
                      >
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Task title..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="follow_up">Follow-up</option>
                    <option value="meeting">Meeting</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Related To</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.relatedTo}
                    onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                    placeholder="Contact/Lead name..."
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .task-manager {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
          margin-bottom: 32px;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .task-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .task-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          align-items: center;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 300px;
        }

        .search-container svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 40px;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: 14px;
        }

        .tasks-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .task-item {
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          margin-bottom: 12px;
          transition: var(--transition);
        }

        .task-item:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow);
        }

        .task-item.completed {
          opacity: 0.7;
          background: var(--gray-50);
        }

        .task-content {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .task-main {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .task-checkbox {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 0;
          transition: var(--transition);
        }

        .task-checkbox:hover {
          color: var(--primary);
        }

        .task-item.completed .task-checkbox {
          color: var(--success);
        }

        .task-info {
          flex: 1;
        }

        .task-title {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-900);
          margin: 0 0 8px 0;
        }

        .task-item.completed .task-title {
          text-decoration: line-through;
          color: var(--gray-500);
        }

        .task-description {
          color: var(--gray-600);
          font-size: 14px;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .task-category,
        .task-due,
        .task-priority {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-500);
          text-transform: capitalize;
        }

        .task-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .action-btn:hover {
          background: var(--gray-100);
        }

        .action-btn.edit:hover {
          color: var(--primary);
        }

        .action-btn.delete:hover {
          color: var(--danger);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--gray-500);
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h4 {
          margin-bottom: 8px;
          color: var(--gray-600);
        }

        @media (max-width: 768px) {
          .task-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            max-width: none;
          }

          .task-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskManager;