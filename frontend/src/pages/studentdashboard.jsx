import { useEffect, useState } from 'react';
import API from '../api';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', course: '' });
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await API.get('/students/me');
      setProfile(res.data);
      setForm({ name: res.data.name, email: res.data.email, course: res.data.course });
    } catch (err) {
      setError('Failed to fetch profile');
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/students/${profile.id}`, form);
      fetchProfile();
    } catch (err) {
      setError('Failed to update');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Student Dashboard</h2>
      <button onClick={logout} style={{ marginBottom: 12 }}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>My Profile</h3>
      <form onSubmit={updateProfile}>
        <div style={{ marginBottom: 8 }}>
          <input name="name" value={form.name} onChange={handleChange} style={{ padding: 8, width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="email" value={form.email} onChange={handleChange} style={{ padding: 8, width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="course" value={form.course} onChange={handleChange} style={{ padding: 8, width: '100%' }} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
