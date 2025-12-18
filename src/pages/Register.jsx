import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Mail, Lock, Eye, EyeOff, Sun, Moon, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/" className="auth-brand">
          Mini CRM
        </Link>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header-text">
                <h1>Create Account</h1>
                <p>Join Mini CRM and start managing your business better</p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <div className="input-group">
                    <Shield size={20} className="input-icon" />
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                      style={{ paddingLeft: '48px' }}
                    >
                      <option value="user">User Account</option>
                      <option value="admin">Admin Account</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-input"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-lg btn-success auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="role-info">
                <h4>Choose Your Account Type</h4>
                <div className="role-grid">
                  <div className={`role-card ${formData.role === 'user' ? 'selected' : ''}`} onClick={() => setFormData({...formData, role: 'user'})}>
                    <div className="role-header">
                      <User size={24} className="role-icon" />
                      <strong>User Account</strong>
                    </div>
                    <div className="role-badge">Perfect for individuals</div>
                    <ul>
                      <li>Manage contacts & leads</li>
                      <li>View personal analytics</li>
                      <li>Update profile settings</li>
                      <li>Export data</li>
                    </ul>
                  </div>
                  <div className={`role-card ${formData.role === 'admin' ? 'selected' : ''}`} onClick={() => setFormData({...formData, role: 'admin'})}>
                    <div className="role-header">
                      <Shield size={24} className="role-icon" />
                      <strong>Admin Account</strong>
                    </div>
                    <div className="role-badge admin">Full system access</div>
                    <ul>
                      <li>All user permissions</li>
                      <li>Manage team members</li>
                      <li>System-wide analytics</li>
                      <li>User role management</li>
                      <li>Advanced reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-image-section">
            <div className="auth-image-content">
              <h2>Start Your CRM Journey</h2>
              <p>
                Transform your business with powerful customer relationship management 
                tools designed specifically for Indian businesses.
              </p>
              <div className="auth-features">
                <div className="feature">✓ Free to start</div>
                <div className="feature">✓ Secure & reliable</div>
                <div className="feature">✓ Indian business ready</div>
                <div className="feature">✓ 24/7 support</div>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Business Growth" 
            />
          </div>
        </div>
      </div>

      <style>{`
        .role-info {
          background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
          padding: 32px;
          border-radius: var(--border-radius-lg);
          margin-top: 32px;
          border: 2px solid var(--gray-200);
        }

        .role-info h4 {
          text-align: center;
          margin-bottom: 24px;
          color: var(--gray-800);
          font-size: 18px;
          font-weight: 600;
        }

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .role-card {
          background: var(--white);
          padding: 24px;
          border-radius: var(--border-radius);
          font-size: 13px;
          border: 2px solid var(--gray-200);
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .role-card:hover::before,
        .role-card.selected::before {
          transform: scaleX(1);
        }

        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .role-card.selected {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 126, 110, 0.1);
        }

        .role-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .role-icon {
          color: var(--primary);
        }

        .role-card strong {
          color: var(--gray-800);
          font-size: 16px;
          font-weight: 600;
        }

        .role-badge {
          display: inline-block;
          background: var(--gradient-primary);
          color: var(--white);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .role-badge.admin {
          background: var(--gradient-secondary);
        }

        .role-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .role-card li {
          margin: 8px 0;
          color: var(--gray-600);
          font-size: 13px;
          line-height: 1.4;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
          z-index: 1;
        }

        .input-group .form-input,
        .input-group .form-select {
          padding-left: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .password-toggle:hover {
          color: var(--primary);
          background: var(--gray-100);
        }

        .auth-submit {
          width: 100%;
          margin-top: 8px;
        }

        .error-message {
          background: linear-gradient(135deg, var(--danger) 0%, var(--danger-light) 100%);
          color: var(--white);
          padding: 12px 16px;
          border-radius: var(--border-radius);
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .role-grid {
            grid-template-columns: 1fr;
          }
          
          .role-info {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;