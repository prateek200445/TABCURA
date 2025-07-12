import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './profile.css';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDocuments = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/documents/${user.id}`);
      if (response.data && response.data.documents) {
        setDocuments(response.data.documents);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchUserDocuments();
  }, [user?.id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <h2>TabCura</h2>
        <div className="nav-links">
          <span>Welcome, {user?.name || 'User'}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <h1>My Profile</h1>
        <div className="documents-section">
          <h2>My Documents</h2>
          {loading ? (
            <div className="loading">Loading documents...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : documents.length === 0 ? (
            <div className="no-documents">
              <p>No documents uploaded yet</p>
              <button className="upload-button">Upload Document</button>
            </div>
          ) : (
            <ul className="documents-list">
              {documents.map(doc => (
                <li key={doc.id} className="document-item">
                  <span>{doc.name}</span>
                  <span>{doc.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
