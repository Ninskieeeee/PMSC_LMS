import { useEffect, useState } from 'react'
import { GraduationCap, Wallet, CalendarCheck, QrCode } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/helpers'

export default function Overview() {
  const { role } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/student/overview')
      .then((res) => setData(res.data))
      .catch(() => setError('Unable to load overview.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  const student = data.student

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {role === 'parent' ? `${student.user?.name}'s Overview` : 'My Overview'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">{student.year_level}{student.strand ? ` - ${student.strand}` : ''}</p>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${role === 'parent' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        <StatCard label="Average Grade" value={data.average_grade ?? '—'} icon={GraduationCap} color="teal" />
        <StatCard label="Balance" value={formatCurrency(data.balance)} icon={Wallet} color="teal" />
        <StatCard label="Events Attended" value={data.events_attended} icon={CalendarCheck} color="teal" />
        {role !== 'parent' && (
          <StatCard label="QR Status" value={data.has_qr ? 'Active' : 'Unavailable'} icon={QrCode} color="teal" />
        )}
      </div>
    </div>
  )
}
