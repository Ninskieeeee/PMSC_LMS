import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function Payments() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/payments').then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>

  const percent = data.total_fee > 0 ? Math.min(100, Math.round((data.total_paid / data.total_fee) * 100)) : 0

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">Track fee balance and payment history.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Paid: {formatCurrency(data.total_paid)}</span>
          <span className="text-gray-500">Total: {formatCurrency(data.total_fee)}</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">{percent}% paid</span>
          <span className="font-medium text-gray-900">Balance: {formatCurrency(data.balance)}</span>
        </div>
      </div>

      {data.payments.length === 0 ? (
        <EmptyState title="No payment history yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Total Fee</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3">{formatDate(payment.date)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(payment.total_fee)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(payment.amount_paid)}</td>
                  <td className="px-4 py-3">{payment.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
