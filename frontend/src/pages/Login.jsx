import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/auth.css';
import instance from '../utils/axios';
import { initSocket } from '../utils/socket'; // ✅ import socket init

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Logging in with', { email, password });

      const response = await instance.post(
        'https://geego-bot.onrender.com/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // ✅ Save token & user in localStorage
      const token = response.data.token;
localStorage.setItem("token", JSON.stringify({ token: response.data.token }));

localStorage.setItem("user", JSON.stringify(response.data.user));

// Small delay before socket init
setTimeout(() => {
  console.log("🔑 Connecting socket with token:", token);
  initSocket(token);
}, 500);


      console.log('✅ Login successful:', response.data);
      navigate('/'); // Redirect to home
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form className="auth-form" onSubmit={handleSubmit} aria-label="login form">
          <label className="auth-label">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-label">
            <span>Password</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
