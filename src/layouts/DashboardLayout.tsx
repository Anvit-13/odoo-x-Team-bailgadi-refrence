import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="sidebar-title">Acme Corp</span>
          {sidebarOpen && (
            <button className="mobile-menu-btn" onClick={toggleSidebar} style={{marginLeft: 'auto'}}>
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard /> Dashboard
          </NavLink>
          
          <NavLink 
            to="/users" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Users /> Users
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Settings /> Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-nav">
          <div className="top-nav-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <div className="search-bar">
              <Search className="search-icon" />
              <input type="text" placeholder="Search everywhere..." className="search-input" />
            </div>
          </div>
          
          <div className="top-nav-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            
            <div className="user-profile">
              <div className="avatar">JD</div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
            
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
