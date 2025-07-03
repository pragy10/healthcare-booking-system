// client/src/components/appointments/BookAppointment.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    const result = await doctorService.getDoctorById(doctorId);
    
    if (result.success) {
      setDoctor(result.data.doctor);
    } else {
      toast.error(result.message);
      navigate('/doctors');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const appointmentData = {
      doctorId: doctorId,
      ...formData
    };

    const result = await appointmentService.createAppointment(appointmentData);
    
    if (result.success) {
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h2>Doctor not found</h2>
            <p>The doctor you're looking for is not available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="booking-container">
            {/* Header */}
            <div className="booking-header">
              <h1>Book Appointment</h1>
              <p>Schedule your consultation with Dr. {doctor.userId.name}</p>
            </div>

            <div className="booking-content">
              {/* Doctor Summary */}
              <div className="doctor-summary card">
                <div className="card-body">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      <img
                        src={doctor.userId.profileImage || '/default-avatar.png'}
                        alt={doctor.userId.name}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="doctor-info">
                      <h3>Dr. {doctor.userId.name}</h3>
                      <p className="specialization">{doctor.specialization}</p>
                      <p className="experience">{doctor.experience} years experience</p>
                      <p className="fee">Consultation Fee: <strong>${doctor.consultationFee}</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="booking-form card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="form-group">
                        <label htmlFor="appointmentDate" className="form-label">
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          id="appointmentDate"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="appointmentTime" className="form-label">
                          Appointment Time
                        </label>
                        <select
                          id="appointmentTime"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          required
                          className="form-select"
                        >
                          <option value="">Select Time</option>
                          {generateTimeSlots().map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="reason" className="form-label">
                        Reason for Visit
                      </label>
                      <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        placeholder="Brief reason for your visit"
                        className="form-input"
                        maxLength={200}
                      />
                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="symptoms" className="form-label">
                        Symptoms (Optional)
                      </label>
                      <textarea
                        id="symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        placeholder="Describe your symptoms in detail"
                        className="form-textarea"
                        rows={4}
                        maxLength={500}
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => navigate('/doctors')}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? 'Booking...' : 'Book Appointment'}
                      </button>
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

export default BookAppointment;
