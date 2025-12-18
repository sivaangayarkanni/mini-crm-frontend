import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  UserPlus,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
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

  const statusOptions = [
    { value: 'new', label: 'New', color: 'var(--info)' },
    { value: 'contacted', label: 'Contacted', color: 'var(--warning)' },
    { value: 'qualified', label: 'Qualified', color: 'var(--primary)' },
    { value: 'proposal', label: 'Proposal', color: 'var(--secondary)' },
    { value: 'negotiation', label: 'Negotiation', color: 'var(--accent)' },
    { value: 'closed_won', label: 'Closed Won', color: 'var(--success)' },
    { value: 'closed_lost', label: 'Closed Lost', color: 'var(--danger)' }
  ];

  const sourceOptions = [
    'website', 'referral', 'social_media', 'advertisement', 'cold_call', 'other'
  ];

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/leads', {
        params: {
          page: currentPage,
          limit: 10,
          status: statusFilter,
          source: sourceFilter
        }
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, sourceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await axios.put(`http://localhost:5000/api/leads/${editingLead._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/leads', formData);
      }
      setShowModal(false);
      setEditingLead(null);
      resetForm();
      fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      value: lead.value,
      probability: lead.probability,
      expectedCloseDate: lead.expectedCloseDate ? lead.expectedCloseDate.split('T')[0] : '',
      notes: lead.notes
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig ? statusConfig.label : status;
  };

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'var(--gray-500)';
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Track and manage your sales pipeline</p>
        </div>

        {/* Pipeline Overview */}
        <div className="pipeline-overview">
          <h3>Sales Pipeline</h3>
          <div className="pipeline-stages">
            {statusOptions.map((status) => {
              const stageLeads = (leads || []).filter(lead => lead.status === status.value);
              const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
              
              return (
                <div key={status.value} className="pipeline-stage">
                  <div className="stage-header" style={{ borderTopColor: status.color }}>
                    <div className="stage-title">{status.label}</div>
                    <div className="stage-count">{stageLeads.length}</div>
                  </div>
                  <div className="stage-value">{formatCurrency(stageValue)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="table-title">
              <UserPlus size={20} />
              All Leads
            </h3>
            <div className="table-actions">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <select
                className="form-select"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">All Sources</option>
                {sourceOptions.map(source => (
                  <option key={source} value={source}>
                    {source.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              <button 
                className="btn"
                onClick={() => {
                  resetForm();
                  setEditingLead(null);
                  setShowModal(true);
                }}
              >
                <Plus size={16} />
                Add Lead
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Probability</th>
                    <th>Expected Close</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(leads || []).map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div className="lead-info">
                          <div className="lead-name">{lead.name}</div>
                          <div className="lead-contact">
                            <span>{lead.email}</span>
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="company-info">
                          <div className="company-name">{lead.company || 'N/A'}</div>
                          <div className="lead-source">
                            Source: {lead.source.replace('_', ' ')}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="lead-value">
                          <DollarSign size={16} />
                          {formatCurrency(lead.value)}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: `${getStatusColor(lead.status)}20`,
                            color: getStatusColor(lead.status)
                          }}
                        >
                          {getStatusBadge(lead.status)}
                        </span>
                      </td>
                      <td>
                        <div className="probability-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ 
                                width: `${lead.probability}%`,
                                backgroundColor: getStatusColor(lead.status)
                              }}
                            ></div>
                          </div>
                          <span className="probability-text">{lead.probability}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={16} />
                          {lead.expectedCloseDate 
                            ? new Date(lead.expectedCloseDate).toLocaleDateString('en-IN')
                            : 'Not set'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(lead._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingLead ? 'Edit Lead' : 'Add New Lead'}
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLead(null);
                    resetForm();
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-select"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                      {sourceOptions.map(source => (
                        <option key={source} value={source}>
                          {source.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Deal Value (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Probability (%)</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    />
                    <div className="range-value">{formData.probability}%</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Expected Close Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this lead..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingLead ? 'Update Lead' : 'Add Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pipeline-overview {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
          margin-bottom: 32px;
        }

        .pipeline-overview h3 {
          margin-bottom: 20px;
          color: var(--gray-900);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pipeline-stages {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .pipeline-stage {
          background: var(--gray-100);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .stage-header {
          background: var(--white);
          padding: 12px 16px;
          border-top: 3px solid var(--primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stage-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-700);
        }

        .stage-count {
          background: var(--primary);
          color: var(--white);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .stage-value {
          padding: 12px 16px;
          font-size: 16px;
          font-weight: 600;
          color: var(--gray-900);
        }

        .lead-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lead-name {
          font-weight: 500;
          color: var(--gray-900);
        }

        .lead-contact {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lead-contact span {
          font-size: 12px;
          color: var(--gray-500);
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .company-name {
          font-weight: 500;
          color: var(--gray-900);
        }

        .lead-source {
          font-size: 12px;
          color: var(--gray-500);
          text-transform: capitalize;
        }

        .lead-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--success);
        }

        .probability-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .progress-bar {
          background: var(--gray-200);
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          width: 80px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .probability-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--gray-600);
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
          font-size: 14px;
        }

        .form-range {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--gray-200);
          outline: none;
          -webkit-appearance: none;
        }

        .form-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
        }

        .form-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: none;
        }

        .range-value {
          text-align: center;
          font-weight: 500;
          color: var(--primary);
          margin-top: 8px;
        }

        .modal-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }
      `}</style>
    </div>
  );
};

export default Leads;