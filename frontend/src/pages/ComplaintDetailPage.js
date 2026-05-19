import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus, analyzeComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

/**
 * ComplaintDetailPage - view complaint details, update status, run AI analysis
 */
const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintById(id);
      setComplaint(res.data.data);
      setSelectedStatus(res.data.data.status);
    } catch {
      toast.error('Complaint not found');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaint(); }, [id]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === complaint.status) return;
    setUpdating(true);
    try {
      await updateComplaintStatus(id, selectedStatus);
      toast.success('Status updated successfully ✅');
      fetchComplaint();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeComplaint(id);
      setComplaint(prev => ({ ...prev, aiAnalysis: res.data.data.aiAnalysis }));
      toast.success('AI analysis complete 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getBadgeClass = (s) => {
    if (s === 'In Progress') return 'badge-progress';
    return `badge-${s.toLowerCase()}`;
  };

  if (loading) return <div className="loading">⏳ Loading complaint details...</div>;
  if (!complaint) return null;

  const ai = complaint.aiAnalysis;
  const hasAI = ai?.priority;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate(-1)}>← Back</button>

      <div className="card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>{complaint.title}</h1>
            <span className={`badge ${getBadgeClass(complaint.status)}`}>{complaint.status}</span>
          </div>
          <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>
            {new Date(complaint.createdAt).toLocaleString()}
          </span>
        </div>

        <hr style={{ margin: '1.2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <div><strong>👤 Name:</strong> {complaint.name}</div>
          <div><strong>📧 Email:</strong> {complaint.email}</div>
          <div><strong>🏷️ Category:</strong> {complaint.category}</div>
          <div><strong>📍 Location:</strong> {complaint.location}</div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <strong>📝 Description:</strong>
          <p style={{ marginTop: '0.4rem', color: '#4a5568', background: '#f7fafc', padding: '1rem', borderRadius: '8px' }}>
            {complaint.description}
          </p>
        </div>

        {/* Admin: Status Update */}
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Update Status:</label>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '0.5rem', border: '1.5px solid #e2e8f0', borderRadius: '8px' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-success btn-sm" onClick={handleStatusUpdate} disabled={updating}>
              {updating ? 'Updating...' : '✅ Update Status'}
            </button>
          </div>
        )}

        {/* AI Analysis Button */}
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? '🤖 Analyzing with AI...' : '🤖 Run AI Analysis'}
        </button>

        {/* AI Analysis Results */}
        {hasAI && (
          <div className="ai-box">
            <h3>🤖 AI Analysis Results</h3>
            <p><strong>⚡ Priority:</strong>{' '}
              <span className={`badge badge-${ai.priority.toLowerCase()}`}>{ai.priority}</span>
            </p>
            <p><strong>🏢 Responsible Department:</strong> {ai.department}</p>
            <p><strong>📋 Summary:</strong> {ai.summary}</p>
            <div style={{ marginTop: '0.8rem', background: 'white', padding: '0.9rem', borderRadius: '8px', border: '1px solid #a5b4fc' }}>
              <strong>💬 Auto-Generated Response:</strong>
              <p style={{ marginTop: '0.4rem', fontStyle: 'italic', color: '#374151' }}>{ai.autoResponse}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
