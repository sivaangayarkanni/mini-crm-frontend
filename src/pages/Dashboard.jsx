import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuickStats from '../components/QuickStats';
import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Building,
  Target,
  Award,
  Clock,
  X,
  Bell,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalLeads: 0,
    totalValue: 0,
    wonLeads: 0,
    conversionRate: 0,
    recentContacts: [],
    recentLeads: []
  });
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new',
    value: 0,
    probability: 10,
    expectedCloseDate: '',
    notes: ''
  });
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'active'
  });
  const [reminderFormData, setReminderFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    relatedTo: '',
    relatedType: 'lead'
  });

  useEffect(() => {
    fetchDashboardData();
    fetchReminders();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contactsRes, leadsRes, analyticsRes] = await Promise.all([
        axios.get('/api/contacts?limit=5'),
        axios.get('/api/leads?limit=5'),
        axios.get('/api/leads/analytics')
      ]);

      setStats({
        totalContacts: contactsRes.data.total || 0,
        totalLeads: analyticsRes.data.totalLeads || 0,
        totalValue: analyticsRes.data.totalValue || 0,
        wonLeads: analyticsRes.data.wonLeads || 0,
        conversionRate: parseFloat(analyticsRes.data.conversionRate) || 0,
        recentContacts: contactsRes.data.contacts || [],
        recentLeads: leadsRes.data.leads || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = () => {
    const savedReminders = localStorage.getItem('crm_reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leads', leadFormData);
      setShowLeadModal(false);
      setLeadFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'website',
        status: 'new',
        value: 0,
        probability: 10,
        expectedCloseDate: '',
        notes: ''
      });
      fetchDashboardData();
      alert('Lead added successfully!');
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contacts', {
        ...contactFormData,
        address: { country: 'India' }
      });
      setShowContactModal(false);
      setContactFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'active'
      });
      fetchDashboardData();
      alert('Contact added successfully!');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact');
    }
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();
    const newReminder = {
      id: Date.now(),
      ...reminderFormData,
      createdAt: new Date().toISOString(),
      completed: false
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('crm_reminders', JSON.stringify(updatedReminders));
    setShowReminderModal(false);
    setReminderFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      relatedTo: '',
      relatedType: 'lead'
    });
    alert('Reminder scheduled successfully!');
  };

  const toggleReminderComplete = (id) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updatedReminders);
    localStorage.setItem('crm_reminders', JSON.stringify(updatedReminders));
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('crm_reminders', JSON.stringify(updatedReminders));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      new: 'status-new',
      contacted: 'status-new',
      qualified: 'status-active',
      closed_won: 'status-won',
      closed_lost: 'status-lost'
    };

    return statusClasses[status] || 'status-new';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            Welcome back, {user?.name}!
          </h1>
          <p className="page-subtitle">
            Here's what's happening with your business today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card card-primary">
            <div className="stat-header">
              <div className="stat-title">Total Contacts</div>
              <div className="stat-icon primary">
                <Users size={24} />
              </div>
            </div>
            <div className="stat-value">{stats.totalContacts}</div>
            <div className="stat-change positive">
              +12% from last month
            </div>
          </div>

          <div className="stat-card card-secondary">
            <div className="stat-header">
              <div className="stat-title">Active Leads</div>
              <div className="stat-icon secondary">
                <UserPlus size={24} />
              </div>
            </div>
            <div className="stat-value">{stats.totalLeads}</div>
            <div className="stat-change positive">
              +8% from last month
            </div>
          </div>

          <div className="stat-card card-warning">
            <div className="stat-header">
              <div className="stat-title">Pipeline Value</div>
              <div className="stat-icon warning">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-change positive">
              +15% from last month
            </div>
          </div>

          <div className="stat-card card-success">
            <div className="stat-header">
              <div className="stat-title">Conversion Rate</div>
              <div className="stat-icon success">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="stat-value">{stats.conversionRate}%</div>
            <div className="stat-change positive">
              +2.3% from last month
            </div>
          </div>
        </div>

        {/* Quick Stats Widget */}
        <QuickStats />

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card primary-action">
              <div className="action-icon primary">
                <UserPlus size={32} />
              </div>
              <h3>Add New Lead</h3>
              <p>Capture a new potential customer</p>
              <button className="btn btn-sm btn-primary" onClick={() => setShowLeadModal(true)}>Add Lead</button>
            </div>
            <div className="action-card secondary-action">
              <div className="action-icon secondary">
                <Users size={32} />
              </div>
              <h3>Add Contact</h3>
              <p>Add a new contact to your database</p>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowContactModal(true)}>Add Contact</button>
            </div>
            <div className="action-card warning-action">
              <div className="action-icon warning">
                <Calendar size={32} />
              </div>
              <h3>Schedule Follow-up</h3>
              <p>Set reminders for important calls</p>
              <button className="btn btn-sm btn-warning" onClick={() => setShowReminderModal(true)}>Schedule</button>
            </div>
            <div className="action-card info-action">
              <div className="action-icon info">
                <TrendingUp size={32} />
              </div>
              <h3>View Reports</h3>
              <p>Analyze your sales performance</p>
              <button className="btn btn-sm btn-info" onClick={() => navigate('/analytics')}>View Analytics</button>
            </div>
          </div>
        </div>

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <div className="reminders-section">
            <div className="section-header">
              <h2><Bell size={20} /> Upcoming Reminders</h2>
            </div>
            <div className="reminders-grid">
              {reminders.filter(r => !r.completed).slice(0, 4).map((reminder) => (
                <div key={reminder.id} className={`reminder-card priority-${reminder.priority}`}>
                  <div className="reminder-header">
                    <h4>{reminder.title}</h4>
                    <div className="reminder-actions">
                      <button onClick={() => toggleReminderComplete(reminder.id)} className="icon-btn">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => deleteReminder(reminder.id)} className="icon-btn delete">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <p>{reminder.description}</p>
                  <div className="reminder-footer">
                    <span className="reminder-date">
                      <Calendar size={14} />
                      {new Date(reminder.dueDate).toLocaleDateString('en-IN')}
                    </span>
                    <span className={`priority-badge ${reminder.priority}`}>
                      {reminder.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-2">
          {/* Recent Contacts */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Recent Contacts</h3>
              <a href="/contacts" className="btn btn-sm btn-outline">View All</a>
            </div>
            <div className="table-content">
              {stats.recentContacts.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>
                          <div className="contact-info">
                            <div className="contact-name">{contact.name}</div>
                            <div className="contact-email">{contact.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="company-info">
                            <Building size={16} />
                            {contact.company || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td>
                          <div className="contact-actions">
                            <Phone size={16} />
                            <Mail size={16} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <h4>No contacts yet</h4>
                  <p>Start by adding your first contact</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Recent Leads</h3>
              <a href="/leads" className="btn btn-sm btn-outline">View All</a>
            </div>
            <div className="table-content">
              {stats.recentLeads.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>
                          <div className="contact-info">
                            <div className="contact-name">{lead.name}</div>
                            <div className="contact-email">{lead.company}</div>
                          </div>
                        </td>
                        <td>
                          <div className="lead-value">
                            <DollarSign size={16} />
                            {formatCurrency(lead.value)}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(lead.status)}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${lead.probability}%` }}
                            ></div>
                            <span className="progress-text">{lead.probability}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <Target size={48} />
                  <h4>No leads yet</h4>
                  <p>Start by adding your first lead</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <h2>Performance Overview</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <Award size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{stats.wonLeads}</div>
                <div className="metric-label">Deals Won</div>
                <div className="metric-change positive">+5 this month</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <Clock size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">24h</div>
                <div className="metric-label">Avg Response Time</div>
                <div className="metric-change positive">-2h improvement</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <TrendingUp size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">85%</div>
                <div className="metric-label">Customer Satisfaction</div>
                <div className="metric-change positive">+3% this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Lead</h2>
              <button className="close-btn" onClick={() => setShowLeadModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleLeadSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" value={leadFormData.name} onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" value={leadFormData.email} onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input type="tel" className="form-input" value={leadFormData.phone} onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={leadFormData.company} onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Value (₹)</label>
                  <input type="number" className="form-input" value={leadFormData.value} onChange={(e) => setLeadFormData({...leadFormData, value: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <select className="form-select" value={leadFormData.source} onChange={(e) => setLeadFormData({...leadFormData, source: e.target.value})}>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social_media">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="cold_call">Cold Call</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowLeadModal(false)}>Cancel</button>
                <button type="submit" className="btn">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Contact</h2>
              <button className="close-btn" onClick={() => setShowContactModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" value={contactFormData.name} onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" value={contactFormData.email} onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input type="tel" className="form-input" value={contactFormData.phone} onChange={(e) => setContactFormData({...contactFormData, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={contactFormData.company} onChange={(e) => setContactFormData({...contactFormData, company: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <input type="text" className="form-input" value={contactFormData.position} onChange={(e) => setContactFormData({...contactFormData, position: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowContactModal(false)}>Cancel</button>
                <button type="submit" className="btn">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Schedule Follow-up</h2>
              <button className="close-btn" onClick={() => setShowReminderModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleReminderSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" value={reminderFormData.title} onChange={(e) => setReminderFormData({...reminderFormData, title: e.target.value})} required placeholder="Follow up with client" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={reminderFormData.description} onChange={(e) => setReminderFormData({...reminderFormData, description: e.target.value})} placeholder="Additional details..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input type="datetime-local" className="form-input" value={reminderFormData.dueDate} onChange={(e) => setReminderFormData({...reminderFormData, dueDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={reminderFormData.priority} onChange={(e) => setReminderFormData({...reminderFormData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowReminderModal(false)}>Cancel</button>
                <button type="submit" className="btn">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .quick-actions {
          margin: 40px 0;
        }

        .quick-actions h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .action-card {
          background: var(--white);
          padding: 24px;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          text-align: center;
          transition: var(--transition);
          border: 2px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .action-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          background: var(--gradient-primary);
          color: var(--white);
        }

        .action-icon.primary {
          background: var(--gradient-primary);
        }

        .action-icon.secondary {
          background: var(--gradient-secondary);
        }

        .action-icon.warning {
          background: linear-gradient(135deg, var(--warning) 0%, var(--warning-light) 100%);
        }

        .action-icon.info {
          background: linear-gradient(135deg, var(--info) 0%, var(--info-light) 100%);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          color: var(--white);
        }

        .stat-icon.primary {
          background: var(--gradient-primary);
        }

        .stat-icon.secondary {
          background: var(--gradient-secondary);
        }

        .stat-icon.warning {
          background: linear-gradient(135deg, var(--warning) 0%, var(--warning-light) 100%);
        }

        .stat-icon.success {
          background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
        }

        .primary-action:hover {
          border-color: var(--primary);
        }

        .secondary-action:hover {
          border-color: var(--secondary);
        }

        .warning-action:hover {
          border-color: var(--warning);
        }

        .info-action:hover {
          border-color: var(--info);
        }

        .action-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--gray-900);
        }

        .action-card p {
          color: var(--gray-600);
          margin-bottom: 16px;
          font-size: 14px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-name {
          font-weight: 500;
          color: var(--gray-900);
        }

        .contact-email {
          font-size: 12px;
          color: var(--gray-500);
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
          font-size: 14px;
        }

        .contact-actions {
          display: flex;
          gap: 8px;
        }

        .contact-actions svg {
          color: var(--gray-500);
          cursor: pointer;
          transition: var(--transition);
        }

        .contact-actions svg:hover {
          color: var(--primary);
        }

        .lead-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: var(--success);
        }

        .progress-bar {
          position: relative;
          background: var(--gray-200);
          border-radius: 10px;
          height: 20px;
          overflow: hidden;
          min-width: 80px;
        }

        .progress-fill {
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 500;
          color: var(--white);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

        .performance-section {
          margin-top: 40px;
        }

        .performance-section h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .metric-card {
          background: var(--white);
          padding: 24px;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 126, 110, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 14px;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .metric-change {
          font-size: 12px;
          font-weight: 500;
        }

        .table-content {
          max-height: 400px;
          overflow-y: auto;
        }

        .reminders-section {
          margin: 40px 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--gray-900);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reminders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .reminder-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 20px;
          border-left: 4px solid var(--primary);
          transition: var(--transition);
        }

        .reminder-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .reminder-card.priority-high {
          border-left-color: var(--danger);
        }

        .reminder-card.priority-medium {
          border-left-color: var(--warning);
        }

        .reminder-card.priority-low {
          border-left-color: var(--info);
        }

        .reminder-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .reminder-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .reminder-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-500);
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .icon-btn:hover {
          background: var(--gray-100);
          color: var(--primary);
        }

        .icon-btn.delete:hover {
          color: var(--danger);
        }

        .reminder-card p {
          color: var(--gray-600);
          font-size: 14px;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .reminder-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reminder-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--gray-500);
        }

        .priority-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .priority-badge.high {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
        }

        .priority-badge.medium {
          background: rgba(255, 193, 7, 0.1);
          color: var(--warning);
        }

        .priority-badge.low {
          background: rgba(23, 162, 184, 0.1);
          color: var(--info);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid var(--gray-200);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-500);
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .close-btn:hover {
          background: var(--gray-100);
          color: var(--gray-900);
        }

        .modal form {
          padding: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--gray-700);
          font-size: 14px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: 14px;
          transition: var(--transition);
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 126, 110, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid var(--gray-200);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;