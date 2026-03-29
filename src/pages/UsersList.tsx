import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react'

export default function UsersList() {
  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'Admin', status: 'Active', department: 'Engineering' },
    { id: 2, name: 'Bob Jones', email: 'bob@company.com', role: 'Manager', status: 'Active', department: 'Sales' },
    { id: 3, name: 'Charlie Dave', email: 'charlie@company.com', role: 'Employee', status: 'Inactive', department: 'Marketing' },
    { id: 4, name: 'Diana King', email: 'diana@company.com', role: 'Manager', status: 'Active', department: 'Design' },
    { id: 5, name: 'Evan Thomas', email: 'evan@company.com', role: 'Employee', status: 'Active', department: 'Engineering' },
    { id: 6, name: 'Fiona Garcia', email: 'fiona@company.com', role: 'Employee', status: 'Pending', department: 'HR' },
  ]

  return (
    <>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Users Directory</h1>
          <p className="page-subtitle">Manage your team members and their account permissions.</p>
        </div>
        <button className="saas-btn saas-btn-primary">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="saas-card" style={{ padding: '0' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
          <div className="saas-input-wrapper" style={{ width: '300px' }}>
            <Search className="saas-icon-left" />
            <input type="text" className="saas-input saas-input-left has-icon-left" placeholder="Search users by name or email..." />
          </div>
          <button className="saas-btn saas-btn-secondary">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="saas-table-container" style={{ border: 'none', borderRadius: '0', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}>
          <table className="saas-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Name & Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><input type="checkbox" /></td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg)', color: 'var(--text-dark)' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{user.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </td>
                  <td>{user.department}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`saas-badge ${user.status === 'Active' ? 'saas-badge-success' : user.status === 'Pending' ? 'saas-badge-warning' : 'saas-badge-neutral'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="saas-btn saas-btn-ghost" style={{ padding: '6px' }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showing 1 to 6 of 6 entries</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="saas-btn saas-btn-secondary" disabled>Previous</button>
            <button className="saas-btn saas-btn-secondary" disabled>Next</button>
          </div>
        </div>
      </div>
    </>
  )
}
