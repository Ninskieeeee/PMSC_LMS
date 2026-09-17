import { useEffect, useMemo, useState } from 'react'
import { Wallet, CheckCircle2, AlertTriangle } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import { formatCurrency } from '../../utils/helpers'

export default function Overview() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/finance/students').then((res) => setStudents(res.data)).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const paid = students.reduce((sum, s) => sum + Number(s.total_paid ?? 0), 0)
    const fee = students.reduce((sum, s) => sum + Number(s.total_fee ?? 0), 0)
    const fullyPaid = students.filter((s) => Number(s.balance) <= 0 && Number(s.total_fee) > 0).length
    const withBalance = students.filter((s) => Number(s.balance) > 0).length
    return { paid, pending: fee - paid, fullyPaid, withBalance }
  }, [students])

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Finance Overview</h1>
        <p className="text-sm text-gray-500">Paid vs. pending balances across all students.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Collected" value={formatCurrency(stats.paid)} icon={Wallet} color="green" />
        <StatCard label="Total Pending" value={formatCurrency(stats.pending)} icon={AlertTriangle} color="amber" />
        <StatCard label="Fully Paid Students" value={stats.fullyPaid} icon={CheckCircle2} color="green" />
        <StatCard label="Students with Balance" value={stats.withBalance} icon={AlertTriangle} color="amber" />
      </div>
    </div>
  )
}
