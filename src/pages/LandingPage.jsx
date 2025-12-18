import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Sun, 
  Moon,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span>Mini CRM</span>
            </div>
            <div className="header-actions">
              <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Streamline Your Business with 
                <span className="text-primary"> Mini CRM</span>
              </h1>
              <p className="hero-subtitle">
                Manage contacts, track leads, and grow your business with our powerful 
                yet simple Customer Relationship Management system. Built for Indian 
                businesses with local insights.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-lg">
                  Start Free Trial
                  <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat">
                  <div className="stat-number">₹50Cr+</div>
                  <div className="stat-label">Revenue Tracked</div>
                </div>
                <div className="stat">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="CRM Dashboard" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features for Growing Businesses</h2>
            <p>Everything you need to manage customer relationships effectively</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Contact Management</h3>
              <p>Organize and manage all your customer contacts in one centralized location with detailed profiles and interaction history.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Lead Tracking</h3>
              <p>Track leads through your sales pipeline with customizable stages and automated follow-up reminders.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Analytics & Reports</h3>
              <p>Get insights into your sales performance with detailed analytics and customizable reports in Indian Rupees.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security with JWT authentication and role-based access control to protect your data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Fast & Responsive</h3>
              <p>Lightning-fast performance with modern React interface that works seamlessly across all devices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Globe size={32} />
              </div>
              <h3>Indian Business Ready</h3>
              <p>Built specifically for Indian businesses with local currency support and regional business practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Why Choose Mini CRM?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Easy to use interface designed for Indian businesses</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Complete customer lifecycle management</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Real-time analytics and reporting in ₹</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Secure data with enterprise-grade protection</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Mobile-responsive design for on-the-go access</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={20} />
                  <span>Role-based access for team collaboration</span>
                </div>
              </div>
            </div>
            <div className="benefits-image">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
                alt="Business Analytics" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>Join thousands of Indian businesses already using Mini CRM to grow their customer relationships</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-lg">
                Start Your Free Trial
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span>Mini CRM</span>
              </div>
              <p>Empowering Indian businesses with smart CRM solutions</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/security">Security</Link>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/careers">Careers</Link>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <Link to="/help">Help Center</Link>
                <Link to="/docs">Documentation</Link>
                <Link to="/api">API</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Mini CRM. All rights reserved. Made in India</p>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
        }

        .landing-header {
          background: var(--white);
          box-shadow: var(--shadow);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--accent) 0%, var(--light) 100%);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--gray-600);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 14px;
          color: var(--gray-600);
        }

        .hero-image img {
          width: 100%;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
        }

        .features {
          padding: 80px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--gray-900);
        }

        .section-header p {
          font-size: 18px;
          color: var(--gray-600);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: var(--white);
          padding: 32px;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          text-align: center;
          transition: var(--transition);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: rgba(0, 126, 110, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--primary);
        }

        .feature-card h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--gray-900);
        }

        .feature-card p {
          color: var(--gray-600);
          line-height: 1.6;
        }

        .benefits {
          padding: 80px 0;
          background: var(--gray-100);
        }

        .benefits-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .benefits-text h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 32px;
          color: var(--gray-900);
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--gray-700);
        }

        .benefit-item svg {
          color: var(--success);
          flex-shrink: 0;
        }

        .benefits-image img {
          width: 100%;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
        }

        .cta {
          padding: 80px 0;
          background: var(--primary);
          color: var(--white);
        }

        .cta-content {
          text-align: center;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 18px;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .footer {
          background: var(--gray-900);
          color: var(--white);
          padding: 60px 0 20px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 40px;
        }

        .footer-brand p {
          margin-top: 16px;
          opacity: 0.8;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .footer-section a {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          margin-bottom: 8px;
          transition: var(--transition);
        }

        .footer-section a:hover {
          color: var(--white);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
          text-align: center;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-content,
          .benefits-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-stats {
            justify-content: center;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;