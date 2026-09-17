import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatDateTime } from '../../utils/helpers'

export default function Events() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/events').then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Events</h1>
        <p className="text-sm text-gray-500">Event participation and attendance rate.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-800">Attendance Rate</span>
          <span className="font-semibold text-gray-900">{data.attendance_rate}%</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${data.attendance_rate}%` }} />
        </div>
      </div>

      {data.events.length === 0 ? (
        <EmptyState title="No events recorded yet" />
      ) : (
        <div className="space-y-2">
          {data.events.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">{event.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(event.date)}
                  {event.attended && event.scanned_at ? ` • Scanned ${formatDateTime(event.scanned_at)}` : ''}
                </p>
              </div>
              {event.attended ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={14} /> Present
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  <XCircle size={14} /> Absent
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
