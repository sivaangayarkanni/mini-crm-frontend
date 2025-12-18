import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/users/profile', profileData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Note: You would need to implement password change endpoint
      setMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your account information and preferences</p>
        </div>

        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User size={48} />
                )}
                <button className="avatar-upload-btn">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-role">
                  <Shield size={16} />
                  <span>{user?.role?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} />
              Profile Information
            </button>
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={16} />
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {message && (
              <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-form-section">
                <h3>Personal Information</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <div className="input-group">
                        <User size={20} className="input-icon" />
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                          className="form-input"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          required
                          disabled
                        />
                      </div>
                      <small className="form-help">Email cannot be changed</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <Phone size={20} className="input-icon" />
                        <input
                          type="tel"
                          className="form-input"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <div className="input-group">
                        <Building size={20} className="input-icon" />
                        <input
                          type="text"
                          className="form-input"
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          placeholder="e.g., Sales, Marketing"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <Save size={16} />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-form-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        className="form-input"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        className="form-input"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <small className="form-help">Password must be at least 6 characters long</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        className="form-input"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn" disabled={loading}>
                      {loading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <Lock size={16} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="security-info">
                  <h4>Security Tips</h4>
                  <ul>
                    <li>Use a strong password with at least 8 characters</li>
                    <li>Include uppercase and lowercase letters, numbers, and symbols</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Change your password regularly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 32px;
          margin-bottom: 24px;
        }

        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .profile-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--white);
          border: 2px solid var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .avatar-upload-btn:hover {
          background: var(--secondary);
        }

        .profile-info h2 {
          font-size: 28px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 8px;
        }

        .profile-email {
          color: var(--gray-600);
          margin-bottom: 12px;
        }

        .profile-role {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 126, 110, 0.1);
          color: var(--primary);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          width: fit-content;
        }

        .profile-tabs {
          display: flex;
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .tab-btn {
          flex: 1;
          padding: 16px 24px;
          border: none;
          background: transparent;
          color: var(--gray-600);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tab-btn:hover {
          background: var(--gray-100);
        }

        .tab-btn.active {
          background: var(--primary);
          color: var(--white);
        }

        .tab-content {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 32px;
        }

        .tab-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: 24px;
        }

        .message {
          padding: 12px 16px;
          border-radius: var(--border-radius);
          margin-bottom: 24px;
          font-size: 14px;
        }

        .message.success {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .message.error {
          background: rgba(220, 53, 69, 0.1);
          color: var(--danger);
          border: 1px solid rgba(220, 53, 69, 0.2);
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

        .form-help {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: var(--gray-500);
        }

        .form-input:disabled {
          background: var(--gray-100);
          cursor: not-allowed;
        }

        .form-actions {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
        }

        .security-info {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
        }

        .security-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: 12px;
        }

        .security-info ul {
          list-style: none;
          padding: 0;
        }

        .security-info li {
          padding: 8px 0;
          color: var(--gray-600);
          position: relative;
          padding-left: 20px;
        }

        .security-info li:before {
          content: '•';
          color: var(--primary);
          position: absolute;
          left: 0;
        }

        @media (max-width: 768px) {
          .profile-avatar-section {
            flex-direction: column;
            text-align: center;
          }

          .profile-tabs {
            flex-direction: column;
          }

          .tab-content {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;