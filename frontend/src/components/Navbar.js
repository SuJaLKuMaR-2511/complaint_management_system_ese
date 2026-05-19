import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Navbar - shown when user is logged in
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">🏛️ Smart Complaint System</Link>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/complaints">All Complaints</Link></li>
        <li><Link to="/register-complaint">+ New Complaint</Link></li>
        <li>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            👤 {user?.name} {user?.role === 'admin' && '(Admin)'}
          </span>
        </li>
        <li>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
