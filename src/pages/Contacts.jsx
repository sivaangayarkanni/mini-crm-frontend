import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  MapPin,
  X
} from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    status: 'active',
    notes: ''
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/contacts', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: statusFilter
        }
      });
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        const response = await axios.put(`http://localhost:5000/api/contacts/${editingContact._id}`, formData);
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post('http://localhost:5000/api/contacts', formData);
        console.log('Create response:', response.data);
      }
      setShowModal(false);
      setEditingContact(null);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      position: contact.position,
      address: {
        street: contact.address?.street || '',
        city: contact.address?.city || '',
        state: contact.address?.state || '',
        pincode: contact.address?.pincode || '',
        country: contact.address?.country || 'India'
      },
      status: contact.status,
      notes: contact.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      status: 'active',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      prospect: 'status-new'
    };
    return statusClasses[status] || 'status-new';
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your customer contacts and relationships</p>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="table-title">
              <Users size={20} />
              All Contacts
            </h3>
            <div className="table-actions">
              <div className="search-container">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
              <button 
                className="btn"
                onClick={() => {
                  resetForm();
                  setEditingContact(null);
                  setShowModal(true);
                }}
              >
                <Plus size={16} />
                Add Contact
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
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {(contacts || []).map((contact) => (
                    <tr key={contact._id}>
                      <td>
                        <div className="contact-info">
                          <div className="contact-name">{contact.name}</div>
                          <div className="contact-details">
                            <span><Mail size={12} /> {contact.email}</span>
                            <span><Phone size={12} /> {contact.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="company-info">
                          <div className="company-name">
                            <Building size={16} />
                            {contact.company || 'N/A'}
                          </div>
                          {contact.position && (
                            <div className="position">{contact.position}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          <MapPin size={16} />
                          <span>
                            {contact.address?.city && contact.address?.state
                              ? `${contact.address.city}, ${contact.address.state}`
                              : 'India'
                            }
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(contact)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(contact._id)}
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
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingContact(null);
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
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, city: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.address.state}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, state: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this contact..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingContact ? 'Update Contact' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-container svg {
          position: absolute;
          left: 12px;
          color: var(--gray-500);
          z-index: 1;
        }

        .search-container .search-input {
          padding-left: 40px;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .contact-details span {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-500);
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .company-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .position {
          font-size: 12px;
          color: var(--gray-500);
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
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

export default Contacts;