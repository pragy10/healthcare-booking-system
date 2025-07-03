// client/src/components/patient/PatientDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const result = await appointmentService.getPatientAppointments({ limit: 5 });
    
    if (result.success) {
      const appointmentData = result.data.appointments;
      setAppointments(appointmentData);
      
      const calculatedStats = appointmentData.reduce((acc, appointment) => {
        acc.total++;
        if (appointment.status === 'scheduled' || appointment.status === 'confirmed') {
          acc.upcoming++;
        } else if (appointment.status === 'completed') {
          acc.completed++;
        } else if (appointment.status === 'cancelled') {
          acc.cancelled++;
        }
        return acc;
      }, { total: 0, upcoming: 0, completed: 0, cancelled: 0 });
      
      setStats(calculatedStats);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const result = await appointmentService.cancelAppointment(appointmentId, 'Cancelled by patient');
      
      if (result.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error(result.message);
      }
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
              <h1>Welcome back, {user?.name}</h1>
              <p>Manage your appointments and health records</p>
            </div>
            <Link to="/doctors" className="btn btn-primary">
              Book Appointment
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid grid grid-cols-4 mb-8">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.upcoming}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
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
                  <p>Book your first appointment with our qualified doctors</p>
                  <Link to="/doctors" className="btn btn-primary">
                    Find Doctors
                  </Link>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-doctor">
                          <h4>Dr. {appointment.doctor.userId.name}</h4>
                          <p>{appointment.doctor.specialization}</p>
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
                        {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="btn btn-ghost btn-sm text-red-600"
                          >
                            Cancel
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
              <p>Update personal information</p>
            </Link>
            <Link to="/appointments" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>All Appointments</h3>
              <p>View appointment history</p>
            </Link>
            <Link to="/doctors" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Find Doctors</h3>
              <p>Search healthcare professionals</p>
            </Link>
            <Link to="/medical-records" className="quick-action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Medical Records</h3>
              <p>Access health records</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
