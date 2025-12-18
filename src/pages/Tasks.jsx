import React from 'react';
import TaskManager from '../components/TaskManager';
import { Calendar } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Calendar size={28} />
            Tasks & Follow-ups
          </h1>
          <p className="page-subtitle">
            Manage your tasks, reminders, and follow-up activities
          </p>
        </div>

        <TaskManager />
      </div>

      <style>{`
        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};

export default Tasks;
