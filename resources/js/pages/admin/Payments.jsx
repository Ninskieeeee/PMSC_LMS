import { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/payments').then((res) => setPayments(res.data)).finally(() => setLoading(false))
  }, [])

  const totals = useMemo(() => {
    const paid = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0)
    const fee = payments.reduce((sum, p) => sum + Number(p.total_fee), 0)
    return { paid, fee, pending: fee - paid }
  }, [payments])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">School-wide payment summary.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Collected" value={formatCurrency(totals.paid)} icon={TrendingUp} color="green" />
        <StatCard label="Total Fees Assessed" value={formatCurrency(totals.fee)} icon={Wallet} color="blue" />
        <StatCard label="Outstanding Balance" value={formatCurrency(totals.pending)} icon={TrendingDown} color="amber" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800 text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Total Fee</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-slate-500">Loading…</td></tr>}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="No payments recorded" /></td></tr>
            )}
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{payment.student?.user?.name}</td>
                <td className="px-4 py-3">{formatDate(payment.date)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(payment.total_fee)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(payment.amount_paid)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(payment.total_fee - payment.amount_paid)}</td>
                <td className="px-4 py-3">{payment.recorded_by?.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
