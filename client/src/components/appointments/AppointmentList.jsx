// client/src/components/appointments/AppointmentList.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-toastify';

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    
    let result;
    if (user?.role === 'patient') {
      result = await appointmentService.getPatientAppointments(filters);
    } else if (user?.role === 'doctor') {
      result = await appointmentService.getDoctorAppointments(filters);
    }
    
    if (result?.success) {
      setAppointments(result.data.appointments);
      setPagination(result.data.pagination);
    } else {
      toast.error(result?.message || 'Failed to fetch appointments');
    }
    setLoading(false);
  }, [user?.role, filters]);

  useEffect(() => {
    if (user?.role) {
      fetchAppointments();
    }
  }, [fetchAppointments, user?.role]);

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const result = await appointmentService.cancelAppointment(appointmentId, 'Cancelled by user');
      
      if (result.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    const result = await appointmentService.updateAppointmentStatus(appointmentId, { status });
    
    if (result.success) {
      toast.success('Appointment updated successfully');
      fetchAppointments();
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
      month: 'long',
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
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Manage your healthcare appointments</p>
          </div>

          {/* Filters */}
          <div className="filters-section card mb-8">
            <div className="card-body">
              <div className="status-filters">
                {[
                  { key: '', label: 'All' },
                  { key: 'scheduled', label: 'Scheduled' },
                  { key: 'confirmed', label: 'Confirmed' },
                  { key: 'completed', label: 'Completed' },
                  { key: 'cancelled', label: 'Cancelled' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleStatusFilter(filter.key)}
                    className={`filter-btn ${filters.status === filter.key ? 'active' : ''}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="appointments-container">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <h3>No appointments found</h3>
                <p>You don't have any appointments matching the selected criteria.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card card">
                    <div className="card-body">
                      <div className="appointment-header">
                        <div className="appointment-date">
                          <div className="date-day">
                            {new Date(appointment.appointmentDate).getDate()}
                          </div>
                          <div className="date-month">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="appointment-time">
                          <span className="time">{appointment.appointmentTime}</span>
                          <span className={`badge ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="appointment-body">
                        {user?.role === 'patient' ? (
                          <div className="doctor-info">
                            <h4>Dr. {appointment.doctor.userId.name}</h4>
                            <p className="specialization">{appointment.doctor.specialization}</p>
                          </div>
                        ) : (
                          <div className="patient-info">
                            <h4>{appointment.patient.name}</h4>
                            <p className="patient-details">
                              {appointment.patient.gender}, {new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years
                            </p>
                          </div>
                        )}

                        <div className="appointment-details">
                          <div className="detail-item">
                            <span className="label">Reason:</span>
                            <span className="value">{appointment.reason}</span>
                          </div>
                          {appointment.symptoms && (
                            <div className="detail-item">
                              <span className="label">Symptoms:</span>
                              <span className="value">{appointment.symptoms}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <span className="label">Fee:</span>
                            <span className="value">${appointment.consultationFee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="appointment-actions">
                        {user?.role === 'patient' && (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="btn btn-ghost btn-sm text-red-600"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {user?.role === 'doctor' && (
                          <div className="doctor-actions">
                            {appointment.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                                  className="btn btn-primary btn-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                  className="btn btn-ghost btn-sm text-red-600"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                className="btn btn-primary btn-sm"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: pagination.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-ghost"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </div>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: pagination.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="btn btn-ghost"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentList;
