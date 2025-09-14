import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include' // to include session cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError('Failed to load user profile');
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Logout failed');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="wrapper">
        <div className="user-info">
          <h1>User Information</h1>
          <hr />
          
          <div className="info-row">
            <strong>Username:</strong>
            <span id="username">{user.users_name}</span>
          </div>
          <hr />

          <div className="info-row">
            <strong>Full Name:</strong>
            <span id="full-name">{user.full_name}</span>
          </div>
          <hr />

          <div className="info-row">
            <strong>Email:</strong>
            <span id="email">{user.email}</span>
          </div>
          <hr />

          <div className="info-row">
            <strong>Phone:</strong>
            <span id="phone">{user.phone}</span>
          </div>
          <hr />

          <div className="info-row">
            <strong>Role:</strong>
            <span id="role">
              {user.role_ID === 1 ? 'Admin' : 'User'}
            </span>
          </div>
          <hr />

          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;