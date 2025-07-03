// client/src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <div className="loading-page">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Verifying Access</h3>
            <p>Please wait while we authenticate your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="page">
        <div className="error-page">
          <div className="error-content">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <div className="access-info">
              <div className="info-item">
                <span className="label">Required Roles:</span>
                <div className="roles-list">
                  {roles.map((role, index) => (
                    <span key={index} className="role-badge">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="info-item">
                <span className="label">Your Role:</span>
                <span className="current-role">{user?.role}</span>
              </div>
            </div>
            <div className="error-actions">
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline"
              >
                Go Back
              </button>
              <Navigate to="/dashboard" className="btn btn-primary">
                Dashboard
              </Navigate>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
