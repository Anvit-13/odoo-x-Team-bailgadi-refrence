import { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'Employee' | 'Manager' | 'Admin'

interface AuthState {
  role: Role | null
  name: string
}

interface AuthContextValue extends AuthState {
  login: (role: Role, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ role: null, name: '' })

  const login = (role: Role, name: string) => setAuth({ role, name })
  const logout = () => setAuth({ role: null, name: '' })

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
