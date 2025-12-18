import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Phone,
  Mail,
  Clock,
  Award
} from 'lucide-react';

const QuickStats = () => {
  const [stats, setStats] = useState({
    todayFollowUps: 0,
    pendingCalls: 0,
    emailsSent: 0,
    meetingsScheduled: 0,
    activeDeals: 0,
    responseTime: '2.5h'
  });

  useEffect(() => {
    // Load stats from localStorage or API
    const tasks = JSON.parse(localStorage.getItem('crm_tasks') || '[]');
    const today = new Date().toDateString();
    
    const todayFollowUps = tasks.filter(t => 
      !t.completed && new Date(t.dueDate).toDateString() === today
    ).length;

    const pendingCalls = tasks.filter(t => 
      !t.completed && t.category === 'call'
    ).length;

    setStats(prev => ({
      ...prev,
      todayFollowUps,
      pendingCalls
    }));
  }, []);

  const statCards = [
    {
      icon: Calendar,
      label: "Today's Follow-ups",
      value: stats.todayFollowUps,
      color: 'primary',
      trend: '+12%',
      trendUp: true
    },
    {
      icon: Phone,
      label: 'Pending Calls',
      value: stats.pendingCalls,
      color: 'warning',
      trend: '-5%',
      trendUp: false
    },
    {
      icon: Mail,
      label: 'Emails Sent',
      value: stats.emailsSent,
      color: 'info',
      trend: '+23%',
      trendUp: true
    },
    {
      icon: Target,
      label: 'Active Deals',
      value: stats.activeDeals,
      color: 'success',
      trend: '+8%',
      trendUp: true
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: stats.responseTime,
      color: 'secondary',
      trend: '-15min',
      trendUp: true
    },
    {
      icon: Award,
      label: 'Meetings Today',
      value: stats.meetingsScheduled,
      color: 'accent',
      trend: '+2',
      trendUp: true
    }
  ];

  return (
    <div className="quick-stats-widget">
      <div className="widget-header">
        <h3>Today's Overview</h3>
        <span className="last-updated">Updated just now</span>
      </div>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon-wrapper">
                <Icon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .quick-stats-widget {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
          margin-bottom: 32px;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .widget-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .last-updated {
          font-size: 12px;
          color: var(--gray-500);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: var(--gray-50);
          border-radius: var(--border-radius);
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: start;
          transition: var(--transition);
          border: 2px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
          border-color: var(--primary);
        }

        .stat-card.primary:hover {
          border-color: var(--primary);
        }

        .stat-card.secondary:hover {
          border-color: var(--secondary);
        }

        .stat-card.success:hover {
          border-color: var(--success);
        }

        .stat-card.warning:hover {
          border-color: var(--warning);
        }

        .stat-card.info:hover {
          border-color: var(--info);
        }

        .stat-card.accent:hover {
          border-color: var(--accent);
        }

        .stat-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-card.primary .stat-icon-wrapper {
          background: rgba(0, 126, 110, 0.1);
          color: var(--primary);
        }

        .stat-card.secondary .stat-icon-wrapper {
          background: rgba(115, 175, 111, 0.1);
          color: var(--secondary);
        }

        .stat-card.success .stat-icon-wrapper {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
        }

        .stat-card.warning .stat-icon-wrapper {
          background: rgba(255, 193, 7, 0.1);
          color: var(--warning);
        }

        .stat-card.info .stat-icon-wrapper {
          background: rgba(23, 162, 184, 0.1);
          color: var(--info);
        }

        .stat-card.accent .stat-icon-wrapper {
          background: rgba(231, 218, 175, 0.2);
          color: var(--dark);
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--gray-600);
          margin-bottom: 6px;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .stat-trend.up {
          color: var(--success);
        }

        .stat-trend.down {
          color: var(--danger);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .stat-value {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickStats;
