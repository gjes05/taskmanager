import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>Login</button>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  button: { padding: '12px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  error: { color: 'red', fontSize: '14px', margin: 0 },
  link: { textAlign: 'center', fontSize: '14px', color: '#666' }
};

export default Login;