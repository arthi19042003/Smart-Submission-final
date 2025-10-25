// client/src/pages/EmployerDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Use the EmployerDashboard CSS which should have similar styles to Dashboard.css
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const { user } = useAuth(); // User object contains employer data

  // Check if essential company info is present for the employer's profile completion
  const isEmployerProfileComplete = user?.companyAddress && user?.organization && user?.department;

  return (
    <div className="container">
      <div className="employer-dashboard"> {/* Use the specific class */}
        {/* Title matching candidate dashboard */}
        <h1>Welcome to Your Dashboard</h1>
        {/* Display Employer's Login Email */}
        <p className="dashboard-email">Email: {user?.email}</p>

        {/* Use dashboard-cards which should be styled by EmployerDashboard.css */}
        <div className="dashboard-cards">

          {/* Card for CANDIDATE Profile (as requested) */}
          <div className="card dashboard-card">
            <div className="card-indicator"></div>
            <div className="card-content">
              <h3>Profile</h3>
              <p>Manage your personal information and work experience</p>
              {/* Links to the candidate profile page */}
              <Link to="/profile" className="btn btn-primary">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Card for CANDIDATE Resume (as requested) */}
          <div className="card dashboard-card">
            <div className="card-indicator"></div>
            <div className="card-content">
              <h3>Resume</h3>
              <p>Upload and manage your resume documents</p>
              {/* Links to the candidate resume page */}
              <Link to="/resume" className="btn btn-primary">
                Manage Resume
              </Link>
            </div>
          </div>

          {/* Card for EMPLOYER Profile */}
          <div className="card dashboard-card">
            <div className="card-indicator"></div>
            <div className="card-content">
              <h3>Employer Profile</h3>
              <p>Manage your company details, projects, and sponsors.</p>
              {/* Links to the employer profile page */}
              <Link to="/employer/profile" className="btn btn-primary">
                Manage Company Profile
              </Link>
            </div>
          </div>

          {/* Card for Profile Completion Status (checking EMPLOYER profile fields) */}
          <div className="card dashboard-card profile-completion-card"> {/* Optional specific class */}
            <div className="card-indicator"></div>
            <div className="card-content">
               <h3>Profile Completion</h3>
               {isEmployerProfileComplete ? (
                 // Style should come from EmployerDashboard.css or general .status-complete
                 <p className="status-complete">Profile information added</p>
               ) : (
                 <p className="status-incomplete">Complete your profile to get started</p>
               )}
               {/* Link to EMPLOYER profile if incomplete */}
               {!isEmployerProfileComplete && (
                 <Link to="/employer/profile" className="btn btn-secondary btn-complete-profile">
                   Complete Profile
                 </Link>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;