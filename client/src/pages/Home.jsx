// client/src/components/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="page">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Healthcare Made <span className="text-primary">Simple</span>
                </h1>
                <p className="hero-description">
                  Connect with qualified doctors, book appointments instantly, 
                  and manage your health records in one secure platform.
                </p>
                <div className="hero-actions">
                  {isAuthenticated ? (
                    <div className="authenticated-actions">
                      <Link to="/doctors" className="btn btn-primary btn-lg">
                        Book Appointment
                      </Link>
                      <Link to="/dashboard" className="btn btn-outline btn-lg">
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : (
                    <div className="guest-actions">
                      <Link to="/register" className="btn btn-primary btn-lg">
                        Get Started
                      </Link>
                      <Link to="/doctors" className="btn btn-outline btn-lg">
                        Browse Doctors
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-card">
                  <div className="card-header">
                    <div className="doctor-avatar">
                      <div className="avatar-placeholder"></div>
                    </div>
                    <div className="doctor-info">
                      <h4>Dr. Sarah Wilson</h4>
                      <p>Cardiologist</p>
                    </div>
                    <span className="badge badge-success">Available</span>
                  </div>
                  <div className="card-body">
                    <div className="appointment-info">
                      <span className="label">Next available</span>
                      <span className="value">Today 2:00 PM</span>
                    </div>
                    <div className="appointment-info">
                      <span className="label">Consultation fee</span>
                      <span className="value">$150</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose Our Platform</h2>
              <p>Everything you need for better healthcare management</p>
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>Verified Doctors</h3>
                <p>All healthcare professionals are certified and verified for your safety and peace of mind.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>Easy Scheduling</h3>
                <p>Book appointments 24/7 with our simple and intuitive booking system.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>Secure Records</h3>
                <p>Your medical data is encrypted and secure. Access your records anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Qualified Doctors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Happy Patients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50k+</div>
                <div className="stat-label">Appointments Booked</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of patients who trust our platform for their healthcare needs.</p>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Your Account
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
