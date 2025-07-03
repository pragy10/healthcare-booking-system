// client/src/components/dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import PatientDashboard from '../patient/PatientDashboard';
import DoctorDashboard from '../doctor/DoctorDashboard';
import AdminDashboard from '../admin/AdminDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <h2>Unable to load dashboard</h2>
            <p>Please try refreshing the page.</p>
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
          <div className="container">
            <div className="error-state">
              <h2>Access denied</h2>
              <p>Your account role is not recognized.</p>
            </div>
          </div>
        </div>
      );
  }
};

export default Dashboard;
