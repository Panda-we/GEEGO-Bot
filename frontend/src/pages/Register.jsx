import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/variables.css'
import '../styles/auth.css'
import instance from '../utils/axios'


const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder - integrate with backend register endpoint
    setLoading(true)



    console.log('Registering', { firstName, lastName, email, password });
    instance.post('https://geego-bot.onrender.com//api/auth/register', {
      fullName: { firstName, lastName },
      email,
      password
    },
      {
        withCredentials: true
      }).then((response) => {
        console.log(response.data);
        navigate('/login');
      }).catch((error) => {
        console.error('Registration error:', error);
      }).finally(() => {
        setLoading(false);
      })


  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="auth-title">Join us today</h1>
        <p className="auth-subtitle">Create your account</p>

        <form className="auth-form" onSubmit={handleSubmit} aria-label="register form">
          <div className="name-row">
            <label className="auth-label small">
              <span>First name</span>
              <input
                className="auth-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                required
              />
            </label>

            <label className="auth-label small">
              <span>Last name</span>
              <input
                className="auth-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                required
              />
            </label>
          </div>

          <label className="auth-label">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@example.com"
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
              placeholder="Create a password"
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </main>
  )
}

export default Register
