import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, FileText, Ban } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type ExpenseStatus = 'draft' | 'waiting' | 'approved' | 'rejected'

interface ApprovalRecord {
  id: number
  subject: string
  employee: string
  category: string
  status: ExpenseStatus
  originalAmount: number
  originalCurrency: string
  convertedAmount: number        // in company base currency (INR)
  convertedCurrency: string
  approverName: string
  decisionAt?: string            // ISO timestamp set on approve/reject
  decisionComment?: string
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED: ApprovalRecord[] = [
  { id: 1, subject: 'Flight to Mumbai', employee: 'John Doe', category: 'Travel', status: 'waiting', originalAmount: 320, originalCurrency: 'USD', convertedAmount: 26624, convertedCurrency: 'INR', approverName: 'Sarah Mitchell' },
  { id: 2, subject: 'Hotel stay 2 nights', employee: 'Priya Sharma', category: 'Accommodation', status: 'waiting', originalAmount: 180, originalCurrency: 'EUR', convertedAmount: 16200, convertedCurrency: 'INR', approverName: 'Sarah Mitchell' },
  { id: 3, subject: 'Team lunch', employee: 'Ravi Kumar', category: 'Meals', status: 'approved', originalAmount: 1800, originalCurrency: 'INR', convertedAmount: 1800, convertedCurrency: 'INR', approverName: 'Sarah Mitchell', decisionAt: '2026-03-27T10:14:00Z', decisionComment: 'Approved — within policy.' },
  { id: 4, subject: 'AWS subscription', employee: 'Alice Chen', category: 'Software', status: 'waiting', originalAmount: 99, originalCurrency: 'USD', convertedAmount: 8233, convertedCurrency: 'INR', approverName: 'Sarah Mitchell' },
  { id: 5, subject: 'Conference ticket', employee: 'Tom Baker', category: 'Training', status: 'rejected', originalAmount: 450, originalCurrency: 'GBP', convertedAmount: 47250, convertedCurrency: 'INR', approverName: 'Sarah Mitchell', decisionAt: '2026-03-26T15:30:00Z', decisionComment: 'Exceeds training budget for Q1.' },
  { id: 6, subject: 'Office stationery', employee: 'Nina Patel', category: 'Office', status: 'draft', originalAmount: 420, originalCurrency: 'INR', convertedAmount: 420, convertedCurrency: 'INR', approverName: 'Sarah Mitchell' },
  { id: 7, subject: 'Cab to client site', employee: 'John Doe', category: 'Travel', status: 'waiting', originalAmount: 650, originalCurrency: 'INR', convertedAmount: 650, convertedCurrency: 'INR', approverName: 'Sarah Mitchell' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const map: Record<ExpenseStatus, { label: string; icon: React.ReactNode; cls: string }> = {
    draft:    { label: 'Draft',           icon: <FileText size={12} />,    cls: 'status-badge draft' },
    waiting:  { label: 'Waiting Approval',icon: <Clock size={12} />,       cls: 'status-badge waiting' },
    approved: { label: 'Approved',        icon: <CheckCircle2 size={12} />,cls: 'status-badge approved' },
    rejected: { label: 'Rejected',        icon: <Ban size={12} />,         cls: 'status-badge rejected' },
  }
  const { label, icon, cls } = map[status]
  return (
    <span className={cls}>
      <span className="status-dot" />
      {icon}
      {label}
    </span>
  )
}

// ── Action modal (comment + confirm) ─────────────────────────────────────────

interface ActionModalProps {
  record: ApprovalRecord
  action: 'approve' | 'reject'
  onConfirm: (id: number, action: 'approve' | 'reject', comment: string) => void
  onCancel: () => void
}

function ActionModal({ record, action, onConfirm, onCancel }: ActionModalProps) {
  const [comment, setComment] = useState('')
  const isApprove = action === 'approve'

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3 className="modal-title">
          {isApprove ? 'Approve' : 'Reject'} Request
        </h3>
        <p className="modal-desc">
          <strong>{record.subject}</strong> — {record.employee}
          <br />
          {record.convertedCurrency} {record.convertedAmount.toLocaleString('en-IN')}
          {record.originalCurrency !== record.convertedCurrency && (
            <span className="modal-orig"> (orig. {record.originalCurrency} {record.originalAmount.toLocaleString()})</span>
          )}
        </p>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label htmlFor="modal-comment">
            Comment <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
          </label>
          <textarea
            id="modal-comment"
            placeholder={isApprove ? 'Add an approval note…' : 'Reason for rejection…'}
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ minHeight: 72 }}
          />
        </div>

        <div className="modal-actions">
          <button className="saas-btn saas-btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className={`saas-btn ${isApprove ? 'saas-btn-primary' : 'saas-btn-danger'}`}
            onClick={() => onConfirm(record.id, action, comment)}
          >
            {isApprove ? 'Confirm Approve' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ManagerDashboard() {
  const [records, setRecords] = useState<ApprovalRecord[]>(SEED)
  const [modal, setModal] = useState<{ record: ApprovalRecord; action: 'approve' | 'reject' } | null>(null)

  const pendingCount = records.filter(r => r.status === 'waiting').length

  const openModal = (record: ApprovalRecord, action: 'approve' | 'reject') =>
    setModal({ record, action })

  const handleConfirm = (id: number, action: 'approve' | 'reject', comment: string) => {
    setRecords(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: action === 'approve' ? 'approved' : 'rejected',
              decisionAt: new Date().toISOString(),
              decisionComment: comment || undefined,
            }
          : r
      )
    )
    setModal(null)
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Approvals to Review</h1>
          <p className="page-subtitle">
            {pendingCount} request{pendingCount !== 1 ? 's' : ''} waiting for your decision
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="saas-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="saas-table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="saas-table">
            <thead>
              <tr>
                <th>Approval Subject</th>
                <th>Request Owner</th>
                <th>Category</th>
                <th>Request Status</th>
                <th>Original Amount</th>
                <th>Total Amount (INR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  {/* Subject */}
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{record.subject}</div>
                    {record.decisionAt && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {record.status === 'approved' ? 'Approved' : 'Rejected'} by {record.approverName} · {formatTs(record.decisionAt)}
                      </div>
                    )}
                    {record.decisionComment && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 1 }}>
                        "{record.decisionComment}"
                      </div>
                    )}
                  </td>

                  {/* Owner */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {record.employee.split(' ').map(w => w[0]).join('')}
                      </div>
                      {record.employee}
                    </div>
                  </td>

                  {/* Category */}
                  <td>{record.category}</td>

                  {/* Status */}
                  <td><StatusBadge status={record.status} /></td>

                  {/* Original amount */}
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {record.originalCurrency} {record.originalAmount.toLocaleString()}
                  </td>

                  {/* Converted amount */}
                  <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {record.convertedCurrency} {record.convertedAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Actions */}
                  <td>
                    {record.status === 'waiting' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="saas-btn saas-btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12, gap: 4 }}
                          onClick={() => openModal(record, 'approve')}
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          className="saas-btn saas-btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12, gap: 4 }}
                          onClick={() => openModal(record, 'reject')}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {records.length} total · {pendingCount} pending · {records.filter(r => r.status === 'approved').length} approved · {records.filter(r => r.status === 'rejected').length} rejected
          </span>
        </div>
      </div>

      {/* Confirmation modal */}
      {modal && (
        <ActionModal
          record={modal.record}
          action={modal.action}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
