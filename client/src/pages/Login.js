// client/src/pages/Login.js
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate, Navigate } from 'react-router-dom'; // Added Navigate
import { useAuth } from '../context/AuthContext';
import '../App.css'; // Assuming common auth styles are here or in index.css

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading } = useAuth(); // Get user and authLoading state
  const navigate = useNavigate();

  // --- Redirect if already logged in ---
  // We check this here because Login is now the root page
  useEffect(() => {
    if (!authLoading && user) {
      // If done loading auth state and a user exists, redirect immediately
      const targetDashboard = user.userType === 'employer' ? '/employer/dashboard' : '/dashboard';
      console.log(`Login Page: User already logged in (${user.email}, type: ${user.userType}), redirecting to ${targetDashboard}`);
      navigate(targetDashboard, { replace: true });
    }
  }, [user, authLoading, navigate]);
  // --- End Redirect ---


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
     // Clear error message when user types
     if (error) {
        setError('');
     }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    // The login function in AuthContext should return { success: boolean, error?: string, user?: object }
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success && result.user) {
      // --- Redirect based on userType ---
      if (result.user.userType === 'employer') {
        console.log("Login successful (Employer), navigating to /employer/dashboard");
        navigate('/employer/dashboard'); // Redirect employers here
      } else {
        console.log("Login successful (Candidate), navigating to /dashboard");
        navigate('/dashboard'); // Candidates go to candidate dashboard
      }
      // --- End Redirect ---
    } else {
      setError(result.error || 'Login failed. Please check your credentials.'); // More specific default error
    }
  };

  // If initial auth check is happening, show loading (optional)
  // Or if the useEffect hook is about to redirect, prevent form flash
  if (authLoading || (!authLoading && user)) {
      return <div className="loading">Loading...</div>; // Or null, or a dedicated loading spinner component
  }

  // Render the login form if not logged in and auth state is loaded
  return (
    // Reuse the existing auth container styling
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label> {/* Added htmlFor */}
          <input
            id="email" // Added id
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label> {/* Added htmlFor */}
          <input
            id="password" // Added id
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        {/* Display error message */}
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register as Candidate</Link> or <Link to="/register/employer">Register as Employer</Link>
      </p>
    </div>
  );
};

export default Login;