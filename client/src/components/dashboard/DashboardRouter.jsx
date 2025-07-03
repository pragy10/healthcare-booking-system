// client/src/components/dashboard/DashboardRouter.jsx
import { useAuth } from '../../context/AuthContext';
import PatientDashboard from '../patient/PatientDashboard';
import DoctorDashboard from '../doctor/DoctorDashboard';
import AdminDashboard from '../admin/AdminDashboard';

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page">
        <div className="loading-page">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Loading Dashboard</h3>
            <p>Preparing your personalized experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <div className="error-page">
          <div className="error-content">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2>Unable to Load Dashboard</h2>
            <p>Please refresh the page or contact support if the issue persists.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="page">
          <div className="error-page">
            <div className="error-content">
              <div className="error-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Access Denied</h2>
              <p>Your account role (<strong>{user?.role || 'Unknown'}</strong>) is not recognized.</p>
              <div className="error-actions">
                <button 
                  onClick={() => window.location.href = '/profile'} 
                  className="btn btn-outline"
                >
                  Check Profile
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'} 
                  className="btn btn-primary"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;
