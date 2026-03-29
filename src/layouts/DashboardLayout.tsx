import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  Receipt,
  ClipboardCheck,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { role, name, logout } = useAuth()

  const isEmployee = role === 'Employee'
  const isManager  = role === 'Manager'
  const isAdmin    = role === 'Admin'

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (role?.[0] ?? '?')

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/login')
  }

  const handleSettings = () => {
    setDropdownOpen(false)
    navigate('/settings')
  }

  return (
    <div className="dashboard-wrapper">
      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <header className="top-nav">

        {/* Brand */}
        <div className="top-nav-brand">
          <div className="brand-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="brand-name">Reimbursement Manager</span>
        </div>

        {/* Nav links — role-based */}
        <nav className="top-nav-links">
          {isEmployee && (
            <NavLink to="/expenses" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <Receipt size={15} /> Expenses
            </NavLink>
          )}
          {isManager && (
            <NavLink to="/approvals" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <ClipboardCheck size={15} /> Approvals
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={15} /> Admin
            </NavLink>
          )}
        </nav>

        {/* Right controls */}
        <div className="top-nav-right">
          {/* Bell */}
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>

          {/* Profile dropdown */}
          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="avatar">{initials}</div>
              <div className="user-info">
                <span className="user-name">{name || 'User'}</span>
                <span className="user-role">{role}</span>
              </div>
              <ChevronDown size={14} className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{initials}</div>
                  <div>
                    <div className="user-name">{name || 'User'}</div>
                    <div className="user-role">{role}</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { setDropdownOpen(false) }}>
                  <User size={14} /> Profile
                </button>
                <button className="dropdown-item" onClick={handleSettings}>
                  <Settings size={14} /> Settings
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Content ───────────────────────────────────────────────────── */}
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  )
}
