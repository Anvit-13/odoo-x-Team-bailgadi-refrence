import { Navigate, Outlet, Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Settings from './pages/Settings'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { useAuth } from './context/AuthContext'
import type { Role } from './context/AuthContext'
import './components/ui.css'

function defaultPath(role: Role | null) {
  if (role === 'Manager') return '/approvals'
  if (role === 'Admin')   return '/admin'
  return '/expenses'
}

function RoleGuard({ allowed }: { allowed: Role[] }) {
  const { role } = useAuth()
  if (!role) return <Navigate to="/login" replace />
  if (!allowed.includes(role)) return <Navigate to={defaultPath(role)} replace />
  return <Outlet />
}

function App() {
  const { role } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to={defaultPath(role)} replace />} />

          <Route element={<RoleGuard allowed={['Employee']} />}>
            <Route path="expenses" element={<EmployeeDashboard />} />
          </Route>

          <Route element={<RoleGuard allowed={['Manager']} />}>
            <Route path="approvals" element={<ManagerDashboard />} />
          </Route>

          <Route element={<RoleGuard allowed={['Admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
