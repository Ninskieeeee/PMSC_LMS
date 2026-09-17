import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { formatDateTime } from '../../utils/helpers'

export default function Attendance() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState('')
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ssg/events').then((res) => setEvents(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .get('/ssg/attendance', { params: { event_id: eventId || undefined } })
      .then((res) => setAttendance(res.data))
      .finally(() => setLoading(false))
  }, [eventId])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Attendance Log</h1>
        <p className="text-sm text-gray-500">Full attendance history across all events.</p>
      </div>

      <div className="max-w-xs">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
          <option value="">All Events</option>
          {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Access Code</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3">Scanned At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>}
            {!loading && attendance.length === 0 && (
              <tr><td colSpan={5}><EmptyState title="No attendance records found" /></td></tr>
            )}
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{record.event?.name}</td>
                <td className="px-4 py-3">{record.student?.user?.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{record.student?.qr_code}</td>
                <td className="px-4 py-3">{record.student?.year_level}</td>
                <td className="px-4 py-3">{formatDateTime(record.scanned_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
