import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { DAYS } from '../../utils/helpers'

export default function Schedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teacher/schedule').then((res) => setSchedule(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Loading schedule…</p>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500">Your weekly teaching schedule.</p>
      </div>

      {schedule.length === 0 ? (
        <EmptyState title="No schedule assigned yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DAYS.map((day) => {
            const items = schedule.filter((item) => item.day === day)
            return (
              <div key={day} className="rounded-xl border border-gray-200 bg-white p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">{day}</h2>
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400">No classes.</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-blue-50 px-3 py-2">
                        <p className="text-sm font-medium text-blue-900">{item.subject}</p>
                        <p className="text-xs text-blue-700">{item.year_level}</p>
                        <p className="text-xs text-blue-600">{item.time} &middot; {item.room ?? 'TBA'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
