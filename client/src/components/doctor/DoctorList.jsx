// client/src/components/doctor/DoctorList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { toast } from 'react-toastify';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    minFee: '',
    maxFee: '',
    search: ''
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    setLoading(true);
    const result = await doctorService.getAllDoctors(filters);
    
    if (result.success) {
      setDoctors(result.data.doctors);
      setPagination(result.data.pagination);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      city: '',
      minFee: '',
      maxFee: '',
      search: ''
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
            <h1>Find Doctors</h1>
            <p>Search and book appointments with qualified healthcare professionals</p>
          </div>

          {/* Filters */}
          <div className="filters-section card mb-8">
            <div className="card-body">
              <div className="grid grid-cols-5 gap-4">
                <div className="form-group">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by doctor name..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <select
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Specializations</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="number"
                    name="minFee"
                    placeholder="Min Fee"
                    value={filters.minFee}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="maxFee"
                      placeholder="Max Fee"
                      value={filters.maxFee}
                      onChange={handleFilterChange}
                      className="form-input"
                    />
                    <button onClick={clearFilters} className="btn btn-ghost">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-header mb-6">
            <h3>{pagination.total || 0} Doctor{pagination.total !== 1 ? 's' : ''} Found</h3>
          </div>

          {doctors.length === 0 ? (
            <div className="empty-state">
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="doctors-grid grid grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card card">
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
                        <h4>Dr. {doctor.userId.name}</h4>
                        <p className="specialization">{doctor.specialization}</p>
                        <div className="rating">
                          <div className="stars">
                            {'★'.repeat(Math.floor(doctor.rating))}
                            {'☆'.repeat(5 - Math.floor(doctor.rating))}
                          </div>
                          <span className="rating-text">
                            {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="doctor-details">
                      <div className="detail-item">
                        <span className="label">Experience:</span>
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Consultation Fee:</span>
                        <span className="fee">${doctor.consultationFee}</span>
                      </div>
                      {doctor.hospital && (
                        <div className="detail-item">
                          <span className="label">Hospital:</span>
                          <span>{doctor.hospital.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="doctor-actions">
                      <Link 
                        to={`/doctors/${doctor._id}`} 
                        className="btn btn-ghost"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to={`/book-appointment/${doctor._id}`} 
                        className="btn btn-primary"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorList;
