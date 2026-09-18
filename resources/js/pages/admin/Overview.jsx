import { useEffect, useState } from 'react'
import { GraduationCap, Users, Wallet, AlertCircle, Calendar } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Unable to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500 dark:text-slate-400">Loading dashboard…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  const staffCounts = data.staff_counts ?? {}
  const totalStaff = Object.values(staffCounts).reduce((sum, n) => sum + n, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">A snapshot of the whole school portal.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={data.total_students} icon={GraduationCap} color="navy" />
        <StatCard label="Staff Accounts" value={totalStaff} icon={Users} color="blue" />
        <StatCard label="Collected" value={formatCurrency(data.total_collected)} icon={Wallet} color="green" />
        <StatCard label="Pending Balance" value={formatCurrency(data.total_pending)} icon={AlertCircle} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-100">Students by Year Level</h2>
          <div className="space-y-2">
            {Object.entries(data.students_by_year_level ?? {}).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-300">{level}</span>
                <span className="font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-slate-100">
            <Calendar size={16} /> Upcoming Events
          </h2>
          <div className="space-y-2">
            {(data.upcoming_events ?? []).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-slate-400">No upcoming events.</p>
            )}
            {(data.upcoming_events ?? []).map((event) => (
              <div key={event.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-300">{event.name}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(event.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
