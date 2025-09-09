import { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', course: 'MERN Bootcamp' });
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students');
      // API returns {students, total} - or just students if older shape
      setStudents(res.data.students || res.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/students', form);
      setForm({ name: '', email: '', course: 'MERN Bootcamp' });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const deleteStudent = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout} style={{ marginBottom: 12 }}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Add Student</h3>
      <form onSubmit={addStudent} style={{ marginBottom: 12 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ padding: 8, marginRight: 8 }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ padding: 8, marginRight: 8 }} />
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} style={{ padding: 8, marginRight: 8 }} />
        <button type="submit">Add</button>
      </form>

      <h3>All Students</h3>
      <ul>
        {students.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.name}</strong> ({s.email}) — {s.course}
            <button onClick={() => deleteStudent(s.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
