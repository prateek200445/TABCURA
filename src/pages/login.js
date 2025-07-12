import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './signup.css';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDoctor = location.state?.isDoctor || false;
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const checkServerStatus = async () => {
    try {
      const response = await api.get('/api/health');
      console.log('Server health check:', response.data);
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check server first
      const isServerUp = await checkServerStatus();
      if (!isServerUp) {
        throw new Error('Server is not responding. Please try again later.');
      }

      const response = await api.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
        isDoctor
      });

      if (response.data?.success && response.data?.user) {
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Call the success handler with user data
        onLoginSuccess(response.data.user);
        navigate('/profile');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>{isDoctor ? 'Doctor Portal Login' : 'Welcome Back'}</h1>
          <p>
            {isDoctor 
              ? 'Access your TabCura healthcare provider dashboard'
              : 'Login to access your TabCura health records'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className={`signup-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Don't have an account?</p>
          <button 
            className="login-link" 
            onClick={handleSignup}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
        
        <div className="signup-footer" style={{ marginTop: '10px' }}>
          <button 
            className="login-link" 
            onClick={handleBack}
            disabled={isLoading}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
