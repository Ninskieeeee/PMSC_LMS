import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatDateTime } from '../../utils/helpers'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  useEffect(() => {
    api.get('/admin/events').then((res) => setEvents(res.data)).finally(() => setLoading(false))
  }, [])

  async function toggleExpand(event) {
    if (expanded === event.id) {
      setExpanded(null)
      return
    }
    setExpanded(event.id)
    if (!attendance[event.id]) {
      setAttendanceLoading(true)
      try {
        const { data } = await api.get(`/admin/events/${event.id}/attendance`)
        setAttendance((prev) => ({ ...prev, [event.id]: data }))
      } finally {
        setAttendanceLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Events</h1>
        <p className="text-sm text-gray-500">View events and their attendance records.</p>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {!loading && events.length === 0 && <EmptyState icon={CalendarDays} title="No events yet" />}

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => toggleExpand(event)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{event.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(event.date)} &middot; {event.attendance_count} attendee(s)
                </p>
              </div>
              {expanded === event.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expanded === event.id && (
              <div className="border-t border-gray-100 px-4 py-3">
                {event.description && <p className="mb-3 text-sm text-gray-500">{event.description}</p>}
                {attendanceLoading && !attendance[event.id] && (
                  <p className="text-sm text-gray-400">Loading attendance…</p>
                )}
                {attendance[event.id] && attendance[event.id].length === 0 && (
                  <p className="text-sm text-gray-400">No attendees yet.</p>
                )}
                {attendance[event.id] && attendance[event.id].length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs font-semibold uppercase text-gray-500">
                      <tr>
                        <th className="py-2">Student</th>
                        <th className="py-2">Access Code</th>
                        <th className="py-2">Scanned At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendance[event.id].map((record) => (
                        <tr key={record.id}>
                          <td className="py-2 font-medium text-gray-900">{record.student?.user?.name}</td>
                          <td className="py-2 font-mono text-xs">{record.student?.qr_code}</td>
                          <td className="py-2">{formatDateTime(record.scanned_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
