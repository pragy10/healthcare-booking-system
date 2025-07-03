// client/src/components/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading admin stats
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalDoctors: 85,
        totalPatients: 1165,
        totalAppointments: 3420,
        pendingApprovals: 12,
        monthlyRevenue: 45600
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.name}. Here's what's happening on your platform.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid grid grid-cols-3 mb-8">
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers.toLocaleString()}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDoctors}</div>
              <div className="stat-label">Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalPatients.toLocaleString()}</div>
              <div className="stat-label">Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalAppointments.toLocaleString()}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingApprovals}</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${stats.monthlyRevenue.toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="quick-actions grid grid-cols-4 gap-6">
                <Link to="/admin/users" className="quick-action-card">
                  <div className="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Manage Users</h3>
                  <p>View and manage all platform users</p>
                </Link>

                <Link to="/admin/doctors" className="quick-action-card">
                  <div className="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Doctor Approvals</h3>
                  <p>Review and approve doctor profiles</p>
                </Link>

                <Link to="/admin/appointments" className="quick-action-card">
                  <div className="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Appointments</h3>
                  <p>Monitor all platform appointments</p>
                </Link>

                <Link to="/admin/analytics" className="quick-action-card">
                  <div className="action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Analytics</h3>
                  <p>View platform statistics and reports</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="card-body">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p><strong>Dr. Sarah Wilson</strong> joined the platform</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p>New appointment booked by <strong>John Doe</strong></p>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p><strong>Dr. Michael Brown</strong> profile approved</p>
                    <span className="activity-time">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
