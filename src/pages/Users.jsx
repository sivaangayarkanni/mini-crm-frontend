import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Shield,
  Users as UsersIcon,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Building,
  UserCheck,
  UserX
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    return role === 'admin' ? 'role-admin' : 'role-user';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'status-active' : 'status-inactive';
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage team members and their permissions</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Total Users</div>
              <div className="stat-icon">
                <UsersIcon size={24} />
              </div>
            </div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-change positive">
              Active team members
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-header">
              <div className="stat-title">Administrators</div>
              <div className="stat-icon">
                <Shield size={24} />
              </div>
            </div>
            <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
            <div className="stat-change">
              System administrators
            </div>
          </div>

          <div className="stat-card accent">
            <div className="stat-header">
              <div className="stat-title">Regular Users</div>
              <div className="stat-icon">
                <User size={24} />
              </div>
            </div>
            <div className="stat-value">{users.filter(u => u.role === 'user').length}</div>
            <div className="stat-change">
              Standard access users
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-title">Active Users</div>
              <div className="stat-icon">
                <UserCheck size={24} />
              </div>
            </div>
            <div className="stat-value">{users.filter(u => u.isActive).length}</div>
            <div className="stat-change positive">
              Currently active
            </div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="table-title">
              <UsersIcon size={20} />
              All Users
            </h3>
            <div className="table-actions">
              <div className="search-container">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        {user.phone && (
                          <div className="contact-item">
                            <Phone size={14} />
                            {user.phone}
                          </div>
                        )}
                        <div className="contact-item">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="department-info">
                        <Building size={16} />
                        {user.department || 'Not specified'}
                      </div>
                    </td>
                    <td>
                      <select
                        className={`role-select ${getRoleBadge(user.role)}`}
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(user.isActive)}`}>
                        {user.isActive ? (
                          <>
                            <UserCheck size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX size={14} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          className="action-btn edit"
                          title="Edit user"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Permissions Info */}
        <div className="permissions-info">
          <h2>User Permissions</h2>
          <div className="permissions-grid">
            <div className="permission-card">
              <div className="permission-header">
                <User size={24} />
                <h3>Regular User</h3>
              </div>
              <ul className="permission-list">
                <li>✓ View and manage own contacts</li>
                <li>✓ View and manage own leads</li>
                <li>✓ Access personal analytics</li>
                <li>✓ Update own profile</li>
                <li>✗ Cannot manage other users</li>
                <li>✗ Cannot access system settings</li>
              </ul>
            </div>

            <div className="permission-card admin">
              <div className="permission-header">
                <Shield size={24} />
                <h3>Administrator</h3>
              </div>
              <ul className="permission-list">
                <li>✓ All regular user permissions</li>
                <li>✓ View and manage all contacts</li>
                <li>✓ View and manage all leads</li>
                <li>✓ Access system-wide analytics</li>
                <li>✓ Manage user accounts and roles</li>
                <li>✓ Access system settings</li>
              </ul>
            </div>
          </div>
        </div>
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

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 500;
          color: var(--gray-900);
        }

        .user-email {
          font-size: 12px;
          color: var(--gray-500);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-600);
        }

        .department-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
        }

        .role-select {
          padding: 6px 12px;
          border: 1px solid var(--gray-300);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition);
        }

        .role-select.role-admin {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          border-color: rgba(220, 53, 69, 0.3);
        }

        .role-select.role-user {
          background: rgba(0, 126, 110, 0.1);
          color: var(--primary);
          border-color: rgba(0, 126, 110, 0.3);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .date-info {
          color: var(--gray-600);
          font-size: 14px;
        }

        .permissions-info {
          margin-top: 40px;
        }

        .permissions-info h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .permission-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
          border-left: 4px solid var(--primary);
        }

        .permission-card.admin {
          border-left-color: var(--danger);
        }

        .permission-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .permission-header svg {
          color: var(--primary);
        }

        .permission-card.admin .permission-header svg {
          color: var(--danger);
        }

        .permission-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--gray-900);
        }

        .permission-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .permission-list li {
          padding: 8px 0;
          color: var(--gray-600);
          font-size: 14px;
        }

        .permission-list li:not(:last-child) {
          border-bottom: 1px solid var(--gray-100);
        }

        @media (max-width: 768px) {
          .permissions-grid {
            grid-template-columns: 1fr;
          }

          .user-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .contact-info {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default Users;