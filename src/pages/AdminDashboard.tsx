import { useState } from 'react'
import {
  Plus, Pencil, Trash2, RotateCcw, GripVertical,
  UserPlus, KeyRound, ChevronRight, X, Check,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'Admin' | 'Manager' | 'Employee'

interface AppUser {
  id: number
  name: string
  email: string
  role: UserRole
  managerId: number | null   // only relevant for Employee
}

type ApprovalType = 'sequential' | 'percentage' | 'specific' | 'hybrid'

interface Approver {
  id: number
  userId: number             // references AppUser
  order: number
}

interface ApprovalRule {
  type: ApprovalType
  minPercentage: number      // used for 'percentage' and 'hybrid'
  specificApproverId: number | null  // used for 'specific' and 'hybrid'
  hybridEnabled: boolean
  approvers: Approver[]      // ordered list
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS: AppUser[] = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@acme.com',   role: 'Admin',    managerId: null },
  { id: 2, name: 'David Park',     email: 'david@acme.com',   role: 'Manager',  managerId: null },
  { id: 3, name: 'Priya Sharma',   email: 'priya@acme.com',   role: 'Manager',  managerId: null },
  { id: 4, name: 'John Doe',       email: 'john@acme.com',    role: 'Employee', managerId: 2 },
  { id: 5, name: 'Alice Chen',     email: 'alice@acme.com',   role: 'Employee', managerId: 2 },
  { id: 6, name: 'Ravi Kumar',     email: 'ravi@acme.com',    role: 'Employee', managerId: 3 },
]

const DEFAULT_RULE: ApprovalRule = {
  type: 'sequential',
  minPercentage: 60,
  specificApproverId: null,
  hybridEnabled: false,
  approvers: [
    { id: 1, userId: 2, order: 1 },
    { id: 2, userId: 3, order: 2 },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _uid = 100
const nextId = () => ++_uid

function roleBadge(role: UserRole) {
  const cls: Record<UserRole, string> = {
    Admin:    'saas-badge',
    Manager:  'saas-badge saas-badge-warning',
    Employee: 'saas-badge saas-badge-success',
  }
  return <span className={cls[role]}>{role}</span>
}

const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  sequential: 'Sequential Approval',
  percentage: 'Percentage-Based Approval',
  specific:   'Specific Approver Rule',
  hybrid:     'Hybrid Rule',
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

interface UserFormProps {
  initial?: AppUser
  managers: AppUser[]
  onSave: (u: Omit<AppUser, 'id'> & { id?: number }) => void
  onClose: () => void
}

function UserFormModal({ initial, managers, onSave, onClose }: UserFormProps) {
  const [name,      setName]      = useState(initial?.name  ?? '')
  const [email,     setEmail]     = useState(initial?.email ?? '')
  const [role,      setRole]      = useState<UserRole>(initial?.role ?? 'Employee')
  const [managerId, setManagerId] = useState<number | null>(initial?.managerId ?? null)
  const [error,     setError]     = useState('')

  const handleSave = () => {
    if (!name.trim() || !email.trim()) { setError('Name and email are required.'); return }
    if (role === 'Employee' && !managerId) { setError('Employees must be assigned a manager.'); return }
    onSave({ id: initial?.id, name: name.trim(), email: email.trim(), role, managerId: role === 'Employee' ? managerId : null })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3 className="modal-title">{initial ? 'Edit User' : 'Add New User'}</h3>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@company.com" />
        </div>

        <div className="form-field">
          <label>Role</label>
          <select value={role} onChange={e => { setRole(e.target.value as UserRole); setManagerId(null) }}>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {role === 'Employee' && (
          <div className="form-field">
            <label>Assign Manager</label>
            <select value={managerId ?? ''} onChange={e => setManagerId(Number(e.target.value) || null)}>
              <option value="">— Select manager —</option>
              {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        )}

        {error && <p style={{ fontSize: 12, color: 'var(--error)', marginTop: 4 }}>{error}</p>}

        <div className="modal-actions">
          <button className="saas-btn saas-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="saas-btn saas-btn-primary" onClick={handleSave}>
            <Check size={14} /> {initial ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Approval Rule Summary ────────────────────────────────────────────────────

function RuleSummary({ rule, users }: { rule: ApprovalRule; users: AppUser[] }) {
  const getName = (uid: number) => users.find(u => u.id === uid)?.name ?? 'Unknown'

  const lines: string[] = []
  if (rule.type === 'sequential') {
    lines.push('Approvers must approve in order:')
    rule.approvers.forEach(a => lines.push(`  ${a.order}. ${getName(a.userId)}`))
  }
  if (rule.type === 'percentage' || rule.type === 'hybrid') {
    lines.push(`Minimum ${rule.minPercentage}% of approvers must approve.`)
  }
  if (rule.type === 'specific' || rule.type === 'hybrid') {
    if (rule.specificApproverId)
      lines.push(`Auto-approved if ${getName(rule.specificApproverId)} approves.`)
  }
  if (rule.type === 'hybrid') {
    lines.push('Hybrid: percentage threshold OR specific approver triggers approval.')
  }

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8 }}>
        Current Rule Summary
      </p>
      {lines.map((l, i) => (
        <p key={i} style={{ fontSize: 13, color: 'var(--text-dark)', lineHeight: 1.7 }}>{l}</p>
      ))}
    </div>
  )
}

// ─── Approval Flow Preview ────────────────────────────────────────────────────

function FlowPreview({ rule, users }: { rule: ApprovalRule; users: AppUser[] }) {
  const getName = (uid: number) => users.find(u => u.id === uid)?.name ?? '?'
  const steps = [...rule.approvers].sort((a, b) => a.order - b.order)

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4 }}>Flow:</span>
      <span className="saas-badge" style={{ fontSize: 11 }}>Submitted</span>
      {steps.map((s, i) => (
        <span key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronRight size={13} color="var(--text-muted)" />
          <span className="saas-badge saas-badge-warning" style={{ fontSize: 11 }}>
            {i + 1}. {getName(s.userId)}
          </span>
        </span>
      ))}
      <ChevronRight size={13} color="var(--text-muted)" />
      <span className="saas-badge saas-badge-success" style={{ fontSize: 11 }}>Approved</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [users,   setUsers]   = useState<AppUser[]>(SEED_USERS)
  const [rule,    setRule]    = useState<ApprovalRule>(DEFAULT_RULE)
  const [userModal, setUserModal] = useState<{ open: boolean; editing?: AppUser }>({ open: false })
  const [resetConfirm, setResetConfirm] = useState(false)
  const [toast, setToast] = useState('')

  const managers  = users.filter(u => u.role === 'Manager')
  const approverCandidates = users.filter(u => u.role === 'Manager' || u.role === 'Admin')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  // ── User actions ────────────────────────────────────────────────────────────

  const saveUser = (data: Omit<AppUser, 'id'> & { id?: number }) => {
    if (data.id) {
      setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } as AppUser : u))
      showToast('User updated.')
    } else {
      setUsers(prev => [...prev, { ...data, id: nextId() } as AppUser])
      showToast('User created. Credentials sent.')
    }
    setUserModal({ open: false })
  }

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    showToast('User removed.')
  }

  const resetPassword = (u: AppUser) => showToast(`Password reset email sent to ${u.email}.`)

  // ── Approver list actions ───────────────────────────────────────────────────

  const addApprover = () => {
    const used = new Set(rule.approvers.map(a => a.userId))
    const next = approverCandidates.find(u => !used.has(u.id))
    if (!next) { showToast('All eligible approvers already added.'); return }
    const newOrder = rule.approvers.length + 1
    setRule(r => ({ ...r, approvers: [...r.approvers, { id: nextId(), userId: next.id, order: newOrder }] }))
  }

  const removeApprover = (id: number) => {
    setRule(r => {
      const filtered = r.approvers.filter(a => a.id !== id).map((a, i) => ({ ...a, order: i + 1 }))
      return { ...r, approvers: filtered }
    })
  }

  const moveApprover = (id: number, dir: -1 | 1) => {
    setRule(r => {
      const list = [...r.approvers].sort((a, b) => a.order - b.order)
      const idx  = list.findIndex(a => a.id === id)
      const swap = idx + dir
      if (swap < 0 || swap >= list.length) return r
      ;[list[idx].order, list[swap].order] = [list[swap].order, list[idx].order]
      return { ...r, approvers: list }
    })
  }

  const changeApproverUser = (approverId: number, userId: number) => {
    setRule(r => ({ ...r, approvers: r.approvers.map(a => a.id === approverId ? { ...a, userId } : a) }))
  }

  const resetRules = () => { setRule(DEFAULT_RULE); setResetConfirm(false); showToast('Rules reset to default.') }

  // ── Validation ──────────────────────────────────────────────────────────────

  const ruleErrors: string[] = []
  if ((rule.type === 'percentage' || rule.type === 'hybrid') && (rule.minPercentage < 1 || rule.minPercentage > 100))
    ruleErrors.push('Percentage must be between 1 and 100.')
  if ((rule.type === 'specific' || rule.type === 'hybrid') && !rule.specificApproverId)
    ruleErrors.push('A specific approver must be selected.')
  if (rule.approvers.length === 0)
    ruleErrors.push('At least one approver is required.')

  const sortedApprovers = [...rule.approvers].sort((a, b) => a.order - b.order)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          background: 'var(--primary)', color: '#fff',
          padding: '10px 18px', borderRadius: 'var(--radius-md)',
          fontSize: 13, fontWeight: 500, boxShadow: 'var(--shadow-md)',
        }}>
          {toast}
        </div>
      )}

      {/* ── SECTION 1: User Management ──────────────────────────────────────── */}
      <section>
        <div className="page-header" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Manage team members, roles, and manager assignments.</p>
          </div>
          <button className="saas-btn saas-btn-primary" onClick={() => setUserModal({ open: true })}>
            <UserPlus size={15} /> Add User
          </button>
        </div>

        <div className="saas-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="saas-table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Manager Assigned</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{roleBadge(u.role)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {u.managerId ? users.find(m => m.id === u.managerId)?.name ?? '—' : '—'}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="saas-btn saas-btn-ghost"
                          style={{ padding: '5px 8px', fontSize: 12, gap: 4 }}
                          onClick={() => setUserModal({ open: true, editing: u })}
                          title="Edit"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          className="saas-btn saas-btn-ghost"
                          style={{ padding: '5px 8px', fontSize: 12, gap: 4 }}
                          onClick={() => resetPassword(u)}
                          title="Reset password"
                        >
                          <KeyRound size={13} /> Reset
                        </button>
                        {u.role !== 'Admin' && (
                          <button
                            className="saas-btn saas-btn-ghost"
                            style={{ padding: '5px 8px', fontSize: 12, gap: 4, color: 'var(--error)' }}
                            onClick={() => deleteUser(u.id)}
                            title="Remove user"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {users.length} users · {users.filter(u => u.role === 'Manager').length} managers · {users.filter(u => u.role === 'Employee').length} employees
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Approval Rules ────────────────────────────────────────── */}
      <section>
        <div className="page-header" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="page-title">Approval Rules</h1>
            <p className="page-subtitle">Configure how expense requests are approved. Changes apply to new requests only.</p>
          </div>
          <button
            className="saas-btn saas-btn-secondary"
            onClick={() => setResetConfirm(true)}
          >
            <RotateCcw size={14} /> Reset to Default
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Left: Approver list */}
          <div className="saas-card">
            <div className="saas-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="saas-card-title">Approver Sequence</h3>
                <p className="saas-card-subtitle">Drag to reorder. Expense moves sequentially.</p>
              </div>
              <button className="saas-btn saas-btn-secondary" style={{ fontSize: 12, padding: '6px 10px' }} onClick={addApprover}>
                <Plus size={13} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sortedApprovers.map((a, i) => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)',
                }}>
                  <GripVertical size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', width: 18 }}>{a.order}.</span>
                  <select
                    value={a.userId}
                    onChange={e => changeApproverUser(a.id, Number(e.target.value))}
                    style={{ flex: 1, padding: '5px 8px', fontSize: 13, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', background: '#fff', fontFamily: 'inherit' }}
                  >
                    {approverCandidates.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button className="saas-btn saas-btn-ghost" style={{ padding: '3px 6px' }} onClick={() => moveApprover(a.id, -1)} disabled={i === 0}>↑</button>
                    <button className="saas-btn saas-btn-ghost" style={{ padding: '3px 6px' }} onClick={() => moveApprover(a.id, 1)} disabled={i === sortedApprovers.length - 1}>↓</button>
                    <button className="saas-btn saas-btn-ghost" style={{ padding: '3px 6px', color: 'var(--error)' }} onClick={() => removeApprover(a.id)}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {sortedApprovers.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No approvers added.</p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <FlowPreview rule={rule} users={users} />
            </div>
          </div>

          {/* Right: Rule type config */}
          <div className="saas-card">
            <div className="saas-card-header">
              <h3 className="saas-card-title">Approval Type</h3>
              <p className="saas-card-subtitle">Define the logic that triggers approval.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Type selector */}
              {(Object.keys(APPROVAL_TYPE_LABELS) as ApprovalType[]).map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input
                    type="radio"
                    name="approvalType"
                    value={t}
                    checked={rule.type === t}
                    onChange={() => setRule(r => ({ ...r, type: t }))}
                  />
                  <span style={{ fontWeight: rule.type === t ? 600 : 400, color: 'var(--text-dark)' }}>
                    {APPROVAL_TYPE_LABELS[t]}
                  </span>
                </label>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />

            {/* Percentage input */}
            {(rule.type === 'percentage' || rule.type === 'hybrid') && (
              <div className="saas-input-group">
                <label className="saas-label">Minimum Approval Percentage (%)</label>
                <div className="saas-input-wrapper">
                  <input
                    type="number" min={1} max={100}
                    className="saas-input"
                    value={rule.minPercentage}
                    onChange={e => setRule(r => ({ ...r, minPercentage: Number(e.target.value) }))}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Request is approved when this % of approvers have approved.
                </p>
              </div>
            )}

            {/* Specific approver */}
            {(rule.type === 'specific' || rule.type === 'hybrid') && (
              <div className="saas-input-group">
                <label className="saas-label">Required Approver</label>
                <div className="saas-input-wrapper">
                  <select
                    className="saas-input"
                    value={rule.specificApproverId ?? ''}
                    onChange={e => setRule(r => ({ ...r, specificApproverId: Number(e.target.value) || null }))}
                  >
                    <option value="">— Select approver —</option>
                    {approverCandidates.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Request auto-approves when this person approves.
                </p>
              </div>
            )}

            {/* Hybrid toggle */}
            {rule.type === 'hybrid' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={rule.hybridEnabled}
                  onChange={e => setRule(r => ({ ...r, hybridEnabled: e.target.checked }))}
                />
                Enable hybrid rule (percentage OR specific approver)
              </label>
            )}

            {/* Validation errors */}
            {ruleErrors.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {ruleErrors.map((e, i) => (
                  <p key={i} style={{ fontSize: 12, color: 'var(--error)', marginBottom: 4 }}>⚠ {e}</p>
                ))}
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />

            <RuleSummary rule={rule} users={users} />

            <button
              className="saas-btn saas-btn-primary"
              style={{ width: '100%', marginTop: 16 }}
              disabled={ruleErrors.length > 0}
              onClick={() => showToast('Approval rules saved. Applies to new requests.')}
            >
              <Check size={14} /> Save Rules
            </button>
          </div>
        </div>
      </section>

      {/* User form modal */}
      {userModal.open && (
        <UserFormModal
          initial={userModal.editing}
          managers={managers}
          onSave={saveUser}
          onClose={() => setUserModal({ open: false })}
        />
      )}

      {/* Reset confirm modal */}
      {resetConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3 className="modal-title">Reset Rules to Default?</h3>
            <p className="modal-desc">This will restore the default sequential approval configuration. This only affects new requests.</p>
            <div className="modal-actions">
              <button className="saas-btn saas-btn-secondary" onClick={() => setResetConfirm(false)}>Cancel</button>
              <button className="saas-btn saas-btn-danger" onClick={resetRules}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
