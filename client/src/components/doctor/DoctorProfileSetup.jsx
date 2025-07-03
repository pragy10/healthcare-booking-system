// client/src/components/doctor/DoctorProfileSetup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import doctorService from '../../services/doctorService';

const DoctorProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    consultationFee: '',
    about: '',
    qualifications: [{ degree: '', institution: '', year: '' }],
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: false },
      { day: 'Sunday', startTime: '09:00', endTime: '13:00', isAvailable: false }
    ],
    hospital: {
      name: '',
      address: '',
      city: '',
      state: ''
    }
  });

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Gynecology',
    'Ophthalmology',
    'ENT',
    'Dentistry',
    'Physiotherapy'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('hospital.')) {
      const hospitalField = name.split('.')[1];
      setFormData({
        ...formData,
        hospital: {
          ...formData.hospital,
          [hospitalField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index][field] = value;
    setFormData({
      ...formData,
      qualifications: updatedQualifications
    });
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, { degree: '', institution: '', year: '' }]
    });
  };

  const removeQualification = (index) => {
    const updatedQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      qualifications: updatedQualifications
    });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...formData.availability];
    updatedAvailability[index][field] = field === 'isAvailable' ? value : value;
    setFormData({
      ...formData,
      availability: updatedAvailability
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.specialization || !formData.experience || !formData.consultationFee) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const result = await doctorService.createDoctorProfile(formData);
    
    if (result.success) {
      toast.success('Doctor profile created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="profile-setup-container">
            {/* Header */}
            <div className="setup-header">
              <h1>Complete Your Doctor Profile</h1>
              <p>Provide your professional information to start receiving appointments</p>
            </div>

            <form onSubmit={handleSubmit} className="setup-form">
              {/* Basic Information */}
              <div className="card mb-8">
                <div className="card-header">
                  <h3>Basic Information</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="form-group">
                      <label htmlFor="specialization" className="form-label">
                        Specialization *
                      </label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        min="0"
                        max="50"
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-6">
                    <label htmlFor="consultationFee" className="form-label">
                      Consultation Fee ($) *
                    </label>
                    <input
                      type="number"
                      id="consultationFee"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about" className="form-label">
                      About You
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Tell patients about yourself, your approach to medicine, and your expertise..."
                      className="form-textarea"
                      rows={4}
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="card mb-8">
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <h3>Qualifications</h3>
                    <button
                      type="button"
                      onClick={addQualification}
                      className="btn btn-ghost btn-sm"
                    >
                      Add Qualification
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="qualification-group">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="form-group">
                          <label className="form-label">Degree</label>
                          <input
                            type="text"
                            value={qualification.degree}
                            onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                            placeholder="e.g., MBBS, MD, MS"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Institution</label>
                          <input
                            type="text"
                            value={qualification.institution}
                            onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                            placeholder="University/College name"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Year</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={qualification.year}
                              onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                              placeholder="Graduation year"
                              className="form-input"
                              min="1950"
                              max={new Date().getFullYear()}
                            />
                            {formData.qualifications.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="btn btn-ghost btn-sm text-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospital Information */}
              <div className="card mb-8">
                <div className="card-header">
                  <h3>Hospital/Clinic Information</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label htmlFor="hospital.name" className="form-label">
                        Hospital/Clinic Name
                      </label>
                      <input
                        type="text"
                        id="hospital.name"
                        name="hospital.name"
                        value={formData.hospital.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hospital.city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        id="hospital.city"
                        name="hospital.city"
                        value={formData.hospital.city}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="hospital.address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        id="hospital.address"
                        name="hospital.address"
                        value={formData.hospital.address}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hospital.state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        id="hospital.state"
                        name="hospital.state"
                        value={formData.hospital.state}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="card mb-8">
                <div className="card-header">
                  <h3>Availability Schedule</h3>
                </div>
                <div className="card-body">
                  <div className="availability-grid">
                    {formData.availability.map((schedule, index) => (
                      <div key={schedule.day} className="availability-item">
                        <div className="day-header">
                          <label className="checkbox-wrapper">
                            <input
                              type="checkbox"
                              checked={schedule.isAvailable}
                              onChange={(e) => handleAvailabilityChange(index, 'isAvailable', e.target.checked)}
                            />
                            <span className="day-name">{schedule.day}</span>
                          </label>
                        </div>
                        {schedule.isAvailable && (
                          <div className="time-inputs">
                            <input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                              className="form-input"
                            />
                            <span className="time-separator">to</span>
                            <input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                              className="form-input"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Creating Profile...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfileSetup;
