import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './styles.css';

const menuItems = [
  {
    path: '/',
    name: 'Dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    path: '/cctv',
    name: 'CCTV',
    icon: 'fas fa-video'
  },
  {
    path: '/history',
    name: 'History', 
    icon: 'fa-solid fa-clock-rotate-left'
  },
  {
    path: '/multi-cctv',
    name: 'Multi CCTV', 
    icon: 'fas fa-th'
  },
  {
    path: '/statistics',
    name: 'Statistics',
    icon: 'fas fa-chart-line'
  },
  {
    path: '/manage',
    name: 'Manage',
    icon: 'fas fa-cog'
  }
];

const Navbar = () => {
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <span>SSIMS.AI</span>
        </div>
        <div className="header-actions">
          <button 
            className="notification-btn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <i className="fas fa-bell"></i>
          </button>
        </div>
      </header>

      <nav className="sidebar">
        <div className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span className="tooltip">{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="nav-footer">
          <Link to="/profile" className="nav-item">
            <i className="fas fa-user-circle"></i>
            <span className="tooltip">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;