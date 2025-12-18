import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Home, 
  Users, 
  Target, 
  TrendingUp, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
  Calendar
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'primary' },
    { path: '/contacts', icon: Users, label: 'Contacts', color: 'secondary' },
    { path: '/leads', icon: Target, label: 'Leads', color: 'accent' },
    { path: '/tasks', icon: Calendar, label: 'Tasks', color: 'success' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics', color: 'info' },
    { path: '/profile', icon: User, label: 'Profile', color: 'purple' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/users', icon: Shield, label: 'Users', color: 'warning' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            {!collapsed && <span>Mini CRM</span>}
          </Link>
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path) ? 'active' : ''} ${item.color}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {isActive(item.path) && <div className="active-indicator" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: var(--white);
          border: 2px solid var(--primary);
          border-radius: var(--border-radius);
          padding: 8px;
          color: var(--primary);
          cursor: pointer;
          box-shadow: var(--shadow);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 280px;
          background: var(--white);
          border-right: 1px solid var(--gray-200);
          box-shadow: var(--shadow-lg);
          transition: var(--transition);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary);
          text-decoration: none;
          font-size: 20px;
          font-weight: 700;
        }

        .sidebar-brand span {
          transition: var(--transition);
        }

        .collapse-btn {
          background: var(--gray-100);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--gray-600);
          transition: var(--transition);
        }

        .collapse-btn:hover {
          background: var(--primary);
          color: var(--white);
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin: 4px 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 20px;
          color: var(--gray-700);
          text-decoration: none;
          transition: var(--transition);
          position: relative;
          border-radius: 0 25px 25px 0;
          margin-right: 20px;
        }

        .nav-link:hover {
          background: var(--gray-100);
          color: var(--primary);
          transform: translateX(4px);
        }

        .nav-link.active {
          background: var(--gradient-primary);
          color: var(--white);
          box-shadow: 0 4px 15px rgba(0, 126, 110, 0.3);
        }

        .nav-link.active.secondary {
          background: var(--gradient-secondary);
          box-shadow: 0 4px 15px rgba(115, 175, 111, 0.3);
        }

        .nav-link.active.accent {
          background: var(--gradient-accent);
          color: var(--dark);
          box-shadow: 0 4px 15px rgba(231, 218, 175, 0.3);
        }

        .nav-link.active.info {
          background: linear-gradient(135deg, var(--info) 0%, var(--info-light) 100%);
          box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
        }

        .nav-link.active.purple {
          background: linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 100%);
          box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
        }

        .nav-link.active.warning {
          background: linear-gradient(135deg, var(--warning) 0%, var(--warning-light) 100%);
          color: var(--dark);
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }

        .nav-link.active.success {
          background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .nav-icon {
          flex-shrink: 0;
        }

        .nav-label {
          font-weight: 500;
          transition: var(--transition);
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: var(--white);
          border-radius: 2px 0 0 2px;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--gray-200);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          color: var(--gray-900);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: var(--gray-600);
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }

          .mobile-overlay {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: 280px;
          }

          .collapse-btn {
            display: none;
          }
        }

        .sidebar.collapsed .nav-link {
          justify-content: center;
          margin-right: 0;
          border-radius: 8px;
          margin: 4px 12px;
        }

        .sidebar.collapsed .nav-label {
          display: none;
        }

        .sidebar.collapsed .active-indicator {
          display: none;
        }

        .sidebar.collapsed .user-details {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;