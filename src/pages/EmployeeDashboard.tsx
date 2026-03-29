import { useState } from 'react'
import { Upload, Plus, Paperclip, ChevronRight, CheckCircle2, Clock, FileText } from 'lucide-react'
import './EmployeeDashboard.css'

// ── Types ────────────────────────────────────────────────────────────────────

type ExpenseStatus = 'draft' | 'waiting' | 'approved' | 'rejected'

interface Expense {
  id: number
  employee: string
  description: string
  date: string
  category: string
  paidBy: string
  remarks: string
  amount: number
  currency: string
  status: ExpenseStatus
}

// ── OCR stub — wire real implementation here ─────────────────────────────────
// Expected signature:
//   ocrExtract(file: File): Promise<{ description: string; date: string; amount: string }>
// Replace the body with your actual OCR API call (e.g. Google Vision, AWS Textract, etc.)
async function ocrExtract(_file: File): Promise<{ description: string; date: string; amount: string }> {
  // TODO: implement OCR extraction
  // Example:
  //   const formData = new FormData()
  //   formData.append('file', _file)
  //   const res = await fetch('/api/ocr', { method: 'POST', body: formData })
  //   return res.json()
  void _file
  return new Promise((resolve) =>
    setTimeout(() => resolve({ description: 'Office Supplies', date: '2026-03-29', amount: '1250' }), 1400)
  )
}

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED_EXPENSES: Expense[] = [
  { id: 1, employee: 'John Doe', description: 'Flight to Mumbai', date: '2026-03-20', category: 'Travel', paidBy: 'Self', remarks: 'Client visit', amount: 5460, currency: 'INR', status: 'approved' },
  { id: 2, employee: 'John Doe', description: 'Hotel stay 2 nights', date: '2026-03-21', category: 'Accommodation', paidBy: 'Self', remarks: '', amount: 3360, currency: 'INR', status: 'waiting' },
  { id: 3, employee: 'John Doe', description: 'Team lunch', date: '2026-03-25', category: 'Meals', paidBy: 'Company Card', remarks: 'Q1 review', amount: 1800, currency: 'INR', status: 'draft' },
  { id: 4, employee: 'John Doe', description: 'Cab to airport', date: '2026-03-18', category: 'Travel', paidBy: 'Self', remarks: '', amount: 650, currency: 'INR', status: 'approved' },
  { id: 5, employee: 'John Doe', description: 'Office supplies', date: '2026-03-27', category: 'Office', paidBy: 'Self', remarks: 'Stationery', amount: 420, currency: 'INR', status: 'draft' },
]

const CATEGORIES = ['Travel', 'Accommodation', 'Meals', 'Office', 'Software', 'Training', 'Other']
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD']
const PAID_BY_OPTIONS = ['Self', 'Company Card', 'Manager']

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const labels: Record<ExpenseStatus, string> = {
    draft: 'Draft',
    waiting: 'Waiting',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot" />
      {labels[status]}
    </span>
  )
}

function WorkflowFlow({ expenses }: { expenses: Expense[] }) {
  const draftAmt = expenses.filter(e => e.status === 'draft').reduce((s, e) => s + e.amount, 0)
  const waitingAmt = expenses.filter(e => e.status === 'waiting').reduce((s, e) => s + e.amount, 0)
  const approvedAmt = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0)

  const stages = [
    { key: 'draft', label: 'Draft', amount: draftAmt, icon: <FileText size={16} /> },
    { key: 'waiting', label: 'Waiting Approval', amount: waitingAmt, icon: <Clock size={16} /> },
    { key: 'approved', label: 'Approved', amount: approvedAmt, icon: <CheckCircle2 size={16} /> },
  ]

  return (
    <div className="workflow-card">
      <div className="workflow-card-title">Expense Workflow</div>
      <div className="workflow-flow">
        {stages.map((stage, i) => (
          <>
            <div key={stage.key} className={`workflow-stage ${stage.key}`}>
              <div className={`workflow-stage-bubble ${stage.key}`}>{stage.icon}</div>
              <div className="workflow-stage-label">{stage.label}</div>
              <div className="workflow-stage-amount">₹{stage.amount.toLocaleString('en-IN')}</div>
            </div>
            {i < stages.length - 1 && (
              <div key={`arrow-${i}`} className="workflow-arrow">
                <div className="workflow-arrow-line" />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES)

  // Form state
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [paidBy, setPaidBy] = useState(PAID_BY_OPTIONS[0])
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [remarks, setRemarks] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)

  // ── OCR handler ────────────────────────────────────────────────────────────
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrLoading(true)
    try {
      const result = await ocrExtract(file)
      setDescription(result.description)
      setExpenseDate(result.date)
      setAmount(result.amount)
    } finally {
      setOcrLoading(false)
      e.target.value = ''
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !expenseDate || !amount) return
    const newExpense: Expense = {
      id: Date.now(),
      employee: 'John Doe',
      description,
      date: expenseDate,
      category,
      paidBy,
      remarks,
      amount: parseFloat(amount),
      currency,
      status: 'waiting',
    }
    setExpenses(prev => [newExpense, ...prev])
    setDescription(''); setExpenseDate(''); setAmount(''); setRemarks('')
    setCategory(CATEGORIES[0]); setPaidBy(PAID_BY_OPTIONS[0]); setCurrency('INR')
  }

  // ── New Expense shortcut ───────────────────────────────────────────────────
  const handleNewExpense = () => {
    setDescription(''); setExpenseDate(''); setAmount(''); setRemarks('')
    setCategory(CATEGORIES[0]); setPaidBy(PAID_BY_OPTIONS[0]); setCurrency('INR')
  }

  return (
    <div className="emp-dashboard">

      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="emp-panel">

        {/* Toolbar */}
        <div className="emp-toolbar">
          <label className="saas-btn saas-btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={15} />
            Upload Receipt
            <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleReceiptUpload} />
          </label>
          <button className="saas-btn saas-btn-primary" onClick={handleNewExpense}>
            <Plus size={15} />
            New Expense
          </button>
        </div>

        {/* Workflow visualization */}
        <WorkflowFlow expenses={expenses} />

        {/* Expense table */}
        <div className="expense-table-card">
          <div className="expense-table-header">
            <span className="expense-table-title">My Expenses</span>
            <span style={{ fontSize: '12px', color: '#5A5878' }}>{expenses.length} records</span>
          </div>
          <div className="expense-table-scroll">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th>Remarks</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td className="desc-cell">{exp.description}</td>
                    <td>{exp.date}</td>
                    <td>{exp.category}</td>
                    <td>{exp.paidBy}</td>
                    <td style={{ color: '#5A5878' }}>{exp.remarks || '—'}</td>
                    <td className="amount-cell">{exp.currency} {exp.amount.toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={exp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Submission Form ───────────────────────────────────── */}
      <div className="form-panel">
        <div className="form-panel-header">
          <div className="form-panel-title">Submit Expense</div>
          <div className="form-panel-subtitle">Fill in the details or upload a receipt</div>
        </div>

        <form className="form-panel-body" onSubmit={handleSubmit}>

          {/* Attach receipt */}
          <label className="attach-receipt-btn">
            <Paperclip size={15} />
            Attach Receipt
            <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleReceiptUpload} />
          </label>

          {ocrLoading && (
            <div className="ocr-loading">
              <div className="ocr-spinner" />
              Reading receipt — auto-filling fields…
            </div>
          )}

          {!ocrLoading && (
            <p className="ocr-hint">Uploading a receipt auto-fills amount, date &amp; description via OCR</p>
          )}

          {/* Description */}
          <div className="form-field">
            <label htmlFor="ef-desc">Description</label>
            <textarea
              id="ef-desc"
              placeholder="What was this expense for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Date + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-field">
              <label htmlFor="ef-date">Expense Date</label>
              <input id="ef-date" type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="ef-cat">Category</label>
              <select id="ef-cat" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div className="form-field">
            <label htmlFor="ef-paid">Paid By</label>
            <select id="ef-paid" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              {PAID_BY_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Amount + Currency */}
          <div className="form-field">
            <label>Total Amount</label>
            <div className="amount-row">
              <select
                className="currency-select"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input
                className="amount-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Currency note */}
          <p className="currency-note">
            Amount will be converted to the company base currency (INR) using real-time conversion rates at the time of approval.
          </p>

          {/* Remarks */}
          <div className="form-field">
            <label htmlFor="ef-remarks">Remarks</label>
            <textarea
              id="ef-remarks"
              placeholder="Any additional notes…"
              style={{ minHeight: '52px' }}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>

          {/* Approval info */}
          <div className="approval-info">
            <div className="approval-info-title">Approval Info</div>
            <div className="approval-info-row">
              <span>Approver</span>
              <span>Sarah Mitchell</span>
            </div>
            <div className="approval-info-row">
              <span>Status</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#9896B8', display: 'inline-block' }} />
                Pending submission
              </span>
            </div>
            <div className="approval-info-row">
              <span>SLA</span>
              <span>Within 2 business days</span>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-expense-btn">
            Submit <ChevronRight size={15} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </button>

        </form>
      </div>

    </div>
  )
}
