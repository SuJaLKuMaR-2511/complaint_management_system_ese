import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllComplaints, deleteComplaint, searchByLocation } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Garbage', 'Other'];
const STATUSES = ['', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

/**
 * ComplaintListPage - view, filter, and search all complaints
 */
const ComplaintListPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      if (locationSearch.trim()) {
        const res = await searchByLocation(locationSearch.trim());
        setComplaints(res.data.data);
        setTotalPages(1);
      } else {
        const params = { page, limit: 10 };
        if (category) params.category = category;
        if (status) params.status = status;
        const res = await getAllComplaints(params);
        setComplaints(res.data.data);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [category, status, page]);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch {
      toast.error('Failed to delete complaint');
    }
  };

  const getBadgeClass = (s) => {
    if (s === 'In Progress') return 'badge-progress';
    return `badge-${s.toLowerCase()}`;
  };

  return (
    <div className="page">
      <h1 className="page-title">📋 All Complaints</h1>

      {/* Filters */}
      <div className="filters">
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>

        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>

        <form onSubmit={handleLocationSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text" placeholder="Search by location..."
            value={locationSearch}
            onChange={e => setLocationSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          {locationSearch && (
            <button type="button" className="btn btn-secondary btn-sm"
              onClick={() => { setLocationSearch(''); fetchComplaints(); }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">⏳ Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="card text-center" style={{ color: '#718096', padding: '3rem' }}>
          No complaints found. <Link to="/register-complaint">Add one!</Link>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>AI Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.title}</strong></td>
                    <td>{c.name}</td>
                    <td>{c.category}</td>
                    <td>{c.location}</td>
                    <td><span className={`badge ${getBadgeClass(c.status)}`}>{c.status}</span></td>
                    <td>
                      {c.aiAnalysis?.priority
                        ? <span className={`badge badge-${c.aiAnalysis.priority.toLowerCase()}`}>{c.aiAnalysis.priority}</span>
                        : <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>Not analyzed</span>}
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/complaints/${c._id}`} className="btn btn-sm btn-secondary">View</Link>
                      {user?.role === 'admin' && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-sm btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '0.4rem 0.8rem', background: 'white', borderRadius: '6px' }}>
                Page {page} of {totalPages}
              </span>
              <button className="btn btn-sm btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintListPage;
