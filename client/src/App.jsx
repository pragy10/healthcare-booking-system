import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardRouter from './components/dashboard/DashboardRouter';
import DoctorList from './components/doctor/DoctorList';
import BookAppointment from './components/patient/BookAppointment';
import AppointmentList from './components/appointments/AppointmentList';
import UserProfile from './components/profile/UserProfile';
import DoctorProfileSetup from './components/doctor/DoctorProfileSetup';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Component to conditionally show header and footer
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = ['/login', '/register'];
  
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideHeaderFooter && <Header />}
      <main className={`main-content ${shouldHideHeaderFooter ? 'full-height' : ''}`}>
        {children}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorList />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <AppointmentList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-appointment/:doctorId" 
              element={
                <ProtectedRoute roles={['patient']}>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/profile/create" 
              element={
                <ProtectedRoute roles={['doctor']}>
                  <DoctorProfileSetup />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
