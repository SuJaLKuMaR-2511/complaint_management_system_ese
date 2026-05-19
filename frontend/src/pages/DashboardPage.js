import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllComplaints } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * DashboardPage - shows complaint stats and quick actions
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllComplaints({ limit: 100 })
      .then(res => setComplaints(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const recent = complaints.slice(0, 5);

  return (
    <div className="page">
      <h1 className="page-title">🏠 Dashboard</h1>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Welcome back, <strong>{user?.name}</strong>! Here's a quick overview.
      </p>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#d97706' }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#2563eb' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: '#059669' }}>{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-2">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register-complaint" className="btn btn-primary">📝 Register New Complaint</Link>
          <Link to="/complaints" className="btn btn-secondary">📋 View All Complaints</Link>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Complaints</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : recent.length === 0 ? (
          <p style={{ color: '#718096' }}>No complaints yet. <Link to="/register-complaint">Add one!</Link></p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.location}</td>
                    <td>
                      <span className={`badge badge-${c.status === 'In Progress' ? 'progress' : c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/complaints/${c._id}`} className="btn btn-sm btn-secondary">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
