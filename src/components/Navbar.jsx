import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  User,
  Shield
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            Mini CRM
          </Link>

          <ul className="navbar-nav">
            <li>
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/contacts" 
                className={isActive('/contacts') ? 'active' : ''}
              >
                <Users size={18} />
                Contacts
              </Link>
            </li>
            <li>
              <Link 
                to="/leads" 
                className={isActive('/leads') ? 'active' : ''}
              >
                <UserPlus size={18} />
                Leads
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                className={isActive('/analytics') ? 'active' : ''}
              >
                <TrendingUp size={18} />
                Analytics
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link 
                  to="/users" 
                  className={isActive('/users') ? 'active' : ''}
                >
                  <Shield size={18} />
                  Users
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar-user">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="user-menu">
              <div 
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>

              {showUserMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" style={{ cursor: 'default' }}>
                    <User size={16} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        {user?.role}
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                    style={{ width: '100%', border: 'none', background: 'none' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;