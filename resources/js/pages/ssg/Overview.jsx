import { useEffect, useMemo, useState } from 'react'
import { Calendar, Users, ScanLine } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import { formatDate } from '../../utils/helpers'

export default function Overview() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ssg/events').then((res) => setEvents(res.data)).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = events.filter((e) => e.date >= today).length
    const totalAttendance = events.reduce((sum, e) => sum + (e.attendance_count ?? 0), 0)
    return { upcoming, totalAttendance }
  }, [events])

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">SSG Overview</h1>
        <p className="text-sm text-gray-500">Events and attendance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Events" value={events.length} icon={Calendar} color="green" />
        <StatCard label="Upcoming Events" value={stats.upcoming} icon={Calendar} color="green" />
        <StatCard label="Total Scans" value={stats.totalAttendance} icon={ScanLine} color="green" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Users size={16} /> Recent Events
        </h2>
        <div className="space-y-2">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{event.name}</span>
              <span className="font-medium text-gray-900">{formatDate(event.date)} &middot; {event.attendance_count} scans</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
