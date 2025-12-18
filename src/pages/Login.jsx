import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
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
                <h1>Welcome Back</h1>
                <p>Sign in to your Mini CRM account</p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
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

                <button 
                  type="submit" 
                  className="btn btn-lg btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Create one here
                  </Link>
                </p>
              </div>




            </div>
          </div>

          <div className="auth-image-section">
            <div className="auth-image-content">
              <h2>Manage Your Business Better</h2>
              <p>
                Join thousands of Indian businesses using Mini CRM to streamline 
                their customer relationships and boost sales performance.
              </p>
              <div className="auth-features">
                <div className="feature">✓ Contact Management</div>
                <div className="feature">✓ Lead Tracking</div>
                <div className="feature">✓ Sales Analytics</div>
                <div className="feature">✓ Team Collaboration</div>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Business Team" 
            />
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--gray-100);
        }

        .auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: var(--white);
          box-shadow: var(--shadow);
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
        }

        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
        }

        .auth-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .auth-form-section {
          padding: 60px 40px;
        }

        .auth-form-container {
          max-width: 400px;
          margin: 0 auto;
        }

        .auth-header-text {
          text-align: center;
          margin-bottom: 40px;
        }

        .auth-header-text h1 {
          font-size: 32px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 8px;
        }

        .auth-header-text p {
          color: var(--gray-600);
          font-size: 16px;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: var(--border-radius);
          margin-bottom: 24px;
          font-size: 14px;
        }

        .auth-form {
          margin-bottom: 32px;
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
        }

        .input-group .form-input {
          padding-left: 48px;
          padding-right: 48px;
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
        }

        .password-toggle:hover {
          color: var(--gray-700);
        }

        .auth-submit {
          width: 100%;
          margin-top: 8px;
        }

        .auth-footer {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link:hover {
          text-decoration: underline;
        }





        .auth-image-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: var(--white);
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .auth-image-content {
          position: relative;
          z-index: 2;
          margin-bottom: 40px;
        }

        .auth-image-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .auth-image-content p {
          font-size: 18px;
          margin-bottom: 32px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .auth-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .feature {
          font-size: 16px;
          font-weight: 500;
        }

        .auth-image-section img {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 300px;
          height: 200px;
          object-fit: cover;
          border-radius: var(--border-radius);
          opacity: 0.1;
        }

        @media (max-width: 768px) {
          .auth-content {
            grid-template-columns: 1fr;
          }

          .auth-image-section {
            order: -1;
            padding: 40px 20px;
          }

          .auth-form-section {
            padding: 40px 20px;
          }



          .auth-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;