import React, { useState } from 'react';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('login/', { username, password });
      setAuth({ username }, res.data.access);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '30px' }}>Vibe Chat Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '12px', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
