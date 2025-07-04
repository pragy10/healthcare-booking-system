// client/src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/245/245305.png" alt="VitaBloom Logo" width="32" height="32" />
            </div>
              <span>VitaBloom</span>
            </div>
            <p>Your trusted healthcare companion for better health management.</p>
          </div>
          
          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} HealthCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
