// client/src/components/doctor/DoctorDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    
    try {
      const profileResult = await doctorService.getDoctorProfile();
      if (profileResult.success) {
        setDoctorProfile(profileResult.data.doctor);
      }

      const appointmentsResult = await appointmentService.getDoctorAppointments({ limit: 5 });
      if (appointmentsResult.success) {
        const appointmentData = appointmentsResult.data.appointments;
        setAppointments(appointmentData);
        
        const today = new Date().toDateString();
        const calculatedStats = appointmentData.reduce((acc, appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate).toDateString();
          
          if (appointmentDate === today) {
            acc.todayAppointments++;
          }
          
          if (appointment.status === 'completed') {
            acc.totalEarnings += appointment.consultationFee;
          }
          
          if (appointment.status === 'scheduled') {
            acc.pendingApprovals++;
          }
          
          return acc;
        }, { todayAppointments: 0, totalPatients: appointmentData.length, totalEarnings: 0, pendingApprovals: 0 });
        
        setStats(calculatedStats);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateAppointmentStatus = async (appointmentId, status, notes = '') => {
    const result = await appointmentService.updateAppointmentStatus(appointmentId, { status, notes });
    
    if (result.success) {
      toast.success('Appointment updated successfully');
      fetchDashboardData();
    } else {
      toast.error(result.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'badge-warning';
      case 'confirmed': return 'badge-primary';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
              <h1>Welcome, Dr. {user?.name}</h1>
              <p>Manage your appointments and patient care</p>
            </div>
            <div className="profile-status">
              {doctorProfile ? (
                <div className="profile-info">
                  <span className="specialization">{doctorProfile.specialization}</span>
                  <span className="experience">{doctorProfile.experience} years exp.</span>
                </div>
              ) : (
                <Link to="/doctor/profile/create" className="btn btn-primary">
                  Complete Profile
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid grid grid-cols-4 mb-8">
            <div className="stat-card">
              <div className="stat-number">{stats.todayAppointments}</div>
              <div className="stat-label">Today's Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalPatients}</div>
              <div className="stat-label">Total Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${stats.totalEarnings}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingApprovals}</div>
              <div className="stat-label">Pending Appointments</div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2>Recent Appointments</h2>
                <Link to="/appointments" className="btn btn-ghost btn-sm">
                  View all
                </Link>
              </div>
            </div>
            <div className="card-body">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <h3>No appointments yet</h3>
                  <p>Patients will be able to book appointments once your profile is complete</p>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-patient">
                          <h4>{appointment.patient.name}</h4>
                          <p>{appointment.patient.gender}, {new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years</p>
                        </div>
                        <div className="appointment-details">
                          <div className="detail">
                            <span className="label">Date:</span>
                            <span>{formatDate(appointment.appointmentDate)}</span>
                          </div>
                          <div className="detail">
                            <span className="label">Time:</span>
                            <span>{appointment.appointmentTime}</span>
                          </div>
                          <div className="detail">
                            <span className="label">Reason:</span>
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                      </div>
                      <div className="appointment-actions">
                        <span className={`badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.status === 'scheduled' && (
                          <div className="action-buttons">
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, 'confirmed')}
                              className="btn btn-primary btn-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled', 'Cancelled by doctor')}
                              className="btn btn-ghost btn-sm text-red-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'completed')}
                            className="btn btn-primary btn-sm"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions grid grid-cols-4 gap-6 mt-8">
            <Link to="/profile" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>My Profile</h3>
              <p>Update professional information</p>
            </Link>
            <Link to="/appointments" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>All Appointments</h3>
              <p>Manage appointment schedule</p>
            </Link>
            <Link to="/doctor/schedule" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Schedule</h3>
              <p>Set availability hours</p>
            </Link>
            <Link to="/doctor/earnings" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Earnings</h3>
              <p>View financial reports</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
