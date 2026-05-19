import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ─────────────────────────────────────────────────
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ─── Complaint APIs ────────────────────────────────────────────
export const addComplaint = (data) => API.post('/complaints', data);
export const getAllComplaints = (params) => API.get('/complaints', { params });
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const updateComplaintStatus = (id, status) => API.put(`/complaints/${id}`, { status });
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);
export const searchByLocation = (location) => API.get(`/complaints/search?location=${location}`);

// ─── AI APIs ───────────────────────────────────────────────────
export const analyzeComplaint = (complaintId) => API.post('/ai/analyze', { complaintId });

export default API;
