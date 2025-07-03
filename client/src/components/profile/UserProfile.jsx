// client/src/components/profile/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        updateUser(response.data.data.user);
        setEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
    setEditing(false);
  };

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
              <h1>My Profile</h1>
              <p>Manage your personal information and preferences</p>
            </div>

            <div className="profile-content">
              {/* Profile Summary */}
              <div className="profile-summary card">
                <div className="card-body">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      <img
                        src={user?.profileImage || '/default-avatar.png'}
                        alt={user?.name}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="profile-info">
                      <h2>{user?.name}</h2>
                      <p className="user-role">{user?.role}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="profile-actions">
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="btn btn-primary"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button
                          onClick={handleCancel}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="btn btn-primary"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="profile-form card">
                <div className="card-header">
                  <h3>Personal Information</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                      {user?.role === 'patient' && (
                        <div className="form-group">
                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={!editing}
                            className="form-input"
                          />
                        </div>
                      )}
                    </div>

                    {user?.role === 'patient' && (
                      <div className="form-group mb-6">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-select"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}

                    <h4 className="mb-4">Address Information</h4>
                    
                    <div className="form-group mb-4">
                      <label htmlFor="address.street" className="form-label">Street Address</label>
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label htmlFor="address.city" className="form-label">City</label>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address.state" className="form-label">State</label>
                        <input
                          type="text"
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          id="address.zipCode"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address.country" className="form-label">Country</label>
                        <input
                          type="text"
                          id="address.country"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
