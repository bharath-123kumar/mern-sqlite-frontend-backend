import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', course: 'MERN Bootcamp' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: 16 }}>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Role: </label>
          <select name="role" value={form.role} onChange={handleChange} style={{ padding: 8 }}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <input name="course" placeholder="Course" value={form.course} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Signup</button>
      </form>
      <p style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
