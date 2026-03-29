import { useState } from 'react'
import { User, Users, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type Role } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [role, setRole]               = useState<Role>('Employee')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [errors, setErrors]           = useState<{ email?: string; password?: string }>({})

  const navigate    = useNavigate()
  const { login }   = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}
    if (!email)    newErrors.email    = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setIsLoading(true)
    setTimeout(() => {
      login(role, email.split('@')[0])
      setIsLoading(false)
      const dest = role === 'Manager' ? '/approvals' : role === 'Admin' ? '/admin' : '/expenses'
      navigate(dest)
    }, 1500)
  }

  return (
    <div className="login-container">

      {/* Background video */}
      <video className="login-bg-video" autoPlay muted loop playsInline>
        <source src="/12676946_3840_2160_30fps.mp4" type="video/mp4" />
      </video>
      <div className="login-bg-overlay" />

      {/* Single card split into two halves */}
      <div className="login-split">

        {/* ── LEFT: form panel ── */}
        <div className="login-form-panel">

          <div className="logo-container">
            <div className="logo-box">
              <img src="/ChatGPT Image Mar 29, 2026, 12_58_31 PM.png" alt="Reimbursement Manager logo" width="36" height="36" style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className="header-text">
            <h1>Reimbursement Manager</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Role selector */}
          <div className="role-selector">
            {(['Employee', 'Manager', 'Admin'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                className={`role-tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r === 'Employee' && <User />}
                {r === 'Manager'  && <Users />}
                {r === 'Admin'    && <Shield />}
                {r}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <Mail className="input-icon left" />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }) }}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <Lock className="input-icon left" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }) }}
                />
                <button
                  type="button"
                  className="input-icon right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="options-row">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="spinner" /> : `Sign in as ${role}`}
            </button>
          </form>

          <div className="demo-info">
            <p><strong>Demo:</strong> Any email + password works. Role selection changes your view.</p>
          </div>

          <div className="footer-text">
            Don't have an account?
            <a href="#" className="footer-link">Contact your admin</a>
          </div>
        </div>

        {/* ── RIGHT: image panel ── */}
        <div className="login-image-panel">
          <img
            src="/Gemini_Generated_Image_z6u45z6u45z6u45z.png"
            alt="Reimbursement illustration"
          />
        </div>

      </div>
    </div>
  )
}

export default Login
