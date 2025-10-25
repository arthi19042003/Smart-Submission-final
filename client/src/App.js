// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import EmployerRegister from './pages/EmployerRegister';
import Login from './pages/Login'; // This is now our main entry/landing page
import Dashboard from './pages/Dashboard'; // Candidate Dashboard
import EmployerDashboard from './pages/EmployerDashboard'; // Employer Dashboard
import Profile from './pages/Profile'; // Candidate Profile
import ResumeUpload from './pages/ResumeUpload'; // Candidate Resume
import EmployerProfile from './pages/EmployerProfile'; // Employer Company Profile
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* --- Public Routes --- */}
            {/* Login is now the root/landing page */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/employer" element={<EmployerRegister />} />

            {/* --- Protected Candidate Routes --- */}
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute><Profile /></PrivateRoute>}
            />
            <Route
              path="/resume"
              element={<PrivateRoute><ResumeUpload /></PrivateRoute>}
            />
            {/* Add Interviews Route here when ready */}
            {/* <Route path="/interviews" element={<PrivateRoute><Interviews /></PrivateRoute>} /> */}


            {/* --- Protected Employer Routes --- */}
            <Route
              path="/employer/dashboard"
              element={<PrivateRoute><EmployerDashboard /></PrivateRoute>}
            />
            <Route
              path="/employer/profile"
              element={<PrivateRoute><EmployerProfile /></PrivateRoute>}
            />

            {/* --- Root Route --- */}
            {/* Redirect root to login page if not handled by Login's internal redirect */}
            <Route path="/" element={<Login />} />

            {/* --- Catch-all (Optional) --- */}
            {/* Redirect any unmatched routes back to login or a 404 page */}
            <Route path="*" element={<Navigate replace to="/" />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;