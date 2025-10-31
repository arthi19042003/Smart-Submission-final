// client/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Navigate to login page on logout
  };

  // Determine the correct dashboard link based on user type
  const dashboardLink = user
    ? user.userType === 'employer' ? '/employer/dashboard' : '/dashboard'
    : '/'; // Point to login page if not logged in

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo links to appropriate dashboard if logged in, otherwise login page */}
        <Link to={dashboardLink} className="navbar-logo">
          Smart Submissions
        </Link>
        <div className="navbar-menu">
          {user ? (
            // --- User Logged In ---
            <>
              {user.userType === 'candidate' ? (
                // --- Candidate Links ---
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/profile" className="navbar-link">Profile</Link>
                  <Link to="/resume" className="navbar-link">Resume</Link>
                
                </>
              ) : user.userType === 'employer' ? (
                // --- Employer Links ---
                <>
                  <Link to="/employer/dashboard" className="navbar-link">Employer Dashboard</Link>
                  <Link to="/employer/profile" className="navbar-link">Company Profile</Link>
                  {/* Add other employer-specific links here */}
                </>
              ) : null /* Handle potential unexpected userType */}

              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            // --- User Logged Out ---
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Candidate Signup</Link>
              <Link to="/register/employer" className="navbar-link">Employer Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;