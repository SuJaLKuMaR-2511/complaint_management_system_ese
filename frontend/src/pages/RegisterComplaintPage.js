import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComplaint } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Garbage', 'Other'];

/**
 * RegisterComplaintPage - form to submit a new complaint
 */
const RegisterComplaintPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', title: '', description: '', category: '', location: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await addComplaint(form);
      toast.success('Complaint registered successfully! 🎉');
      navigate(`/complaints/${res.data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || 'Failed to submit complaint';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">📝 Register New Complaint</h1>

      <div className="card" style={{ maxWidth: '700px' }}>
        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Rahul Kumar" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="rahul@gmail.com" required />
            </div>
          </div>

          {/* Complaint Info */}
          <div className="form-group">
            <label>Complaint Title *</label>
            <input type="text" name="title" value={form.title}
              onChange={handleChange} placeholder="e.g. Water Leakage Issue" required />
          </div>

          <div className="form-group">
            <label>Complaint Description *</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              placeholder="Describe the issue in detail..." required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" name="location" value={form.location}
                onChange={handleChange} placeholder="e.g. Ghaziabad, Sector 5" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : '📤 Submit Complaint'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaintPage;
