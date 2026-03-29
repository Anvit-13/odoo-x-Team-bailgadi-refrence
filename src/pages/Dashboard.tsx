import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Here's what's happening today.</p>
        </div>
        <button className="saas-btn saas-btn-primary">Generate Report</button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <p className="saas-card-subtitle">Total Revenue</p>
              <h2 style={{ fontSize: '26px', marginTop: '4px', color: 'var(--text-dark)' }}>$45,231.89</h2>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
            <TrendingUp size={14} />
            <span>+20.1% from last month</span>
          </div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <p className="saas-card-subtitle">Active Users</p>
              <h2 style={{ fontSize: '26px', marginTop: '4px', color: 'var(--text-dark)' }}>2,350</h2>
            </div>
            <div style={{ padding: '8px', backgroundColor: '#EEF2F6', borderRadius: '8px', color: '#3B82F6' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
            <TrendingUp size={14} />
            <span>+18.2% from last month</span>
          </div>
        </div>

        <div className="saas-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <p className="saas-card-subtitle">Active Requests</p>
              <h2 style={{ fontSize: '26px', marginTop: '4px', color: 'var(--text-dark)' }}>12,234</h2>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary)' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            +19% from last month
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="saas-card">
          <div className="saas-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="saas-card-title">Recent Transactions</h3>
            <button className="saas-btn saas-btn-ghost" style={{ fontSize: '13px' }}>View All</button>
          </div>

          <div className="saas-table-container" style={{ border: 'none' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Olivia Martin', email: 'olivia@example.com', initials: 'OM' },
                  { name: 'James Wilson', email: 'james@example.com', initials: 'JW' },
                  { name: 'Sara Lee', email: 'sara@example.com', initials: 'SL' },
                  { name: 'Tom Baker', email: 'tom@example.com', initials: 'TB' },
                  { name: 'Nina Patel', email: 'nina@example.com', initials: 'NP' },
                ].map((item) => (
                  <tr key={item.email}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>{item.initials}</div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: '500' }}>$1,999.00</td>
                    <td><span className="saas-badge saas-badge-success">Completed</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="saas-card">
          <div className="saas-card-header">
            <h3 className="saas-card-title">Quick Actions</h3>
            <p className="saas-card-subtitle">Common tasks</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Invite new user', 'Create new report', 'Update billing settings'].map((label) => (
              <button key={label} className="saas-btn saas-btn-secondary" style={{ justifyContent: 'space-between' }}>
                <span>{label}</span>
                <ArrowUpRight size={15} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
