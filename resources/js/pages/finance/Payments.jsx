import { useEffect, useState } from 'react'
import { Search, Plus, History, Download } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { YEAR_LEVELS, formatCurrency, formatDate } from '../../utils/helpers'

export default function Payments() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearLevel, setYearLevel] = useState('')

  const [payTarget, setPayTarget] = useState(null)
  const [payForm, setPayForm] = useState({ amount_paid: '', total_fee: '', notes: '', date: '' })
  const [saving, setSaving] = useState(false)
  const [payError, setPayError] = useState('')

  const [historyTarget, setHistoryTarget] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/finance/students', { params: { search: search || undefined, year_level: yearLevel || undefined } })
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, yearLevel])

  function openPay(student) {
    setPayTarget(student)
    setPayForm({ amount_paid: '', total_fee: student.total_fee || '', notes: '', date: new Date().toISOString().slice(0, 10) })
    setPayError('')
  }

  async function submitPayment(event) {
    event.preventDefault()
    setSaving(true)
    setPayError('')
    try {
      await api.post(`/finance/students/${payTarget.id}/payments`, payForm)
      setPayTarget(null)
      load()
    } catch (err) {
      setPayError(err.response?.data?.message ?? 'Unable to record payment.')
    } finally {
      setSaving(false)
    }
  }

  async function openHistory(student) {
    setHistoryTarget(student)
    setHistoryLoading(true)
    try {
      const { data } = await api.get(`/finance/students/${student.id}/payments`)
      setHistory(data)
    } finally {
      setHistoryLoading(false)
    }
  }

  async function downloadBilling(student) {
    setDownloadingId(student.id)
    try {
      const response = await api.get(`/finance/students/${student.id}/billing-pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `billing-statement-${student.qr_code}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">Record payments and track student balances.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or access code…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All Year Levels</option>
          {YEAR_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3 text-right">Total Fee</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>}
            {!loading && students.length === 0 && (
              <tr><td colSpan={7}><EmptyState title="No students found" /></td></tr>
            )}
            {students.map((student) => {
              const balance = Number(student.balance)
              const status = balance <= 0 && Number(student.total_fee) > 0
                ? { label: 'Paid', tone: 'bg-emerald-100 text-emerald-700' }
                : balance > 0 && Number(student.total_paid) > 0
                  ? { label: 'Partial', tone: 'bg-amber-100 text-amber-700' }
                  : { label: 'Unpaid', tone: 'bg-red-100 text-red-700' }
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{student.user?.name}</td>
                  <td className="px-4 py-3">{student.year_level}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(student.total_fee)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(student.total_paid)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(balance)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.tone}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openPay(student)} className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50" aria-label="Record payment">
                        <Plus size={15} />
                      </button>
                      <button type="button" onClick={() => openHistory(student)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Payment history">
                        <History size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadBilling(student)}
                        disabled={downloadingId === student.id}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
                        aria-label="Download billing PDF"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(payTarget)}
        onClose={() => setPayTarget(null)}
        title={`Record Payment — ${payTarget?.user?.name ?? ''}`}
        footer={
          <>
            <button type="button" onClick={() => setPayTarget(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="payment-form" disabled={saving} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60">
              {saving ? 'Saving…' : 'Record Payment'}
            </button>
          </>
        }
      >
        <form id="payment-form" onSubmit={submitPayment} className="space-y-3">
          {payError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{payError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Total Fee</label>
              <input type="number" min="0" step="0.01" required value={payForm.total_fee} onChange={(e) => setPayForm({ ...payForm, total_fee: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Amount Paid</label>
              <input type="number" min="0" step="0.01" required value={payForm.amount_paid} onChange={(e) => setPayForm({ ...payForm, amount_paid: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={payForm.date} onChange={(e) => setPayForm({ ...payForm, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Notes</label>
            <input value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(historyTarget)} onClose={() => setHistoryTarget(null)} title={`Payment History — ${historyTarget?.user?.name ?? ''}`} size="lg">
        {historyLoading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : history.length === 0 ? (
          <EmptyState title="No payments recorded yet" />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Total Fee</th>
                <th className="py-2 text-right">Paid</th>
                <th className="py-2">Notes</th>
                <th className="py-2">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-2">{formatDate(payment.date)}</td>
                  <td className="py-2 text-right">{formatCurrency(payment.total_fee)}</td>
                  <td className="py-2 text-right">{formatCurrency(payment.amount_paid)}</td>
                  <td className="py-2">{payment.notes ?? '—'}</td>
                  <td className="py-2">{payment.recorded_by?.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  )
}
