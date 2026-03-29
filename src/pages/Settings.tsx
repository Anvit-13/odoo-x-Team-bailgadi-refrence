import { useState } from 'react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = ['profile', 'team', 'billing']

  return (
    <div style={{ maxWidth: '760px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="saas-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className="saas-btn saas-btn-ghost"
              onClick={() => setActiveTab(tab)}
              style={{
                borderRadius: '0',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                padding: '14px 22px',
                fontWeight: activeTab === tab ? '600' : '500',
                fontSize: '14px',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px' }}>
          {activeTab === 'profile' && (
            <form>
              <h3 className="saas-card-title" style={{ marginBottom: '20px' }}>Personal Information</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="saas-input-group">
                  <label className="saas-label" htmlFor="firstName">First Name</label>
                  <div className="saas-input-wrapper">
                    <input type="text" id="firstName" className="saas-input" placeholder="First name" defaultValue="John" />
                  </div>
                </div>
                <div className="saas-input-group">
                  <label className="saas-label" htmlFor="lastName">Last Name</label>
                  <div className="saas-input-wrapper">
                    <input type="text" id="lastName" className="saas-input" placeholder="Last name" defaultValue="Doe" />
                  </div>
                </div>
              </div>

              <div className="saas-input-group" style={{ maxWidth: '380px' }}>
                <label className="saas-label" htmlFor="settingsEmail">Email Address</label>
                <div className="saas-input-wrapper">
                  <input type="email" id="settingsEmail" className="saas-input" defaultValue="john.doe@company.com" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This is the email you use to sign in.</p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

              <h3 className="saas-card-title" style={{ marginBottom: '20px' }}>Change Password</h3>

              <div className="saas-input-group" style={{ maxWidth: '380px' }}>
                <label className="saas-label" htmlFor="currentPassword">Current Password</label>
                <div className="saas-input-wrapper">
                  <input type="password" id="currentPassword" className="saas-input" placeholder="••••••••" />
                </div>
              </div>

              <div className="saas-input-group" style={{ maxWidth: '380px' }}>
                <label className="saas-label" htmlFor="newPassword">New Password</label>
                <div className="saas-input-wrapper">
                  <input type="password" id="newPassword" className="saas-input" placeholder="••••••••" />
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="saas-btn saas-btn-secondary">Cancel</button>
                <button type="button" className="saas-btn saas-btn-primary">Save Changes</button>
              </div>
            </form>
          )}

          {activeTab !== 'profile' && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '14px' }}>This section is not available in the demo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
