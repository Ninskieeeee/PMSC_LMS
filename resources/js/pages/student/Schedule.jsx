import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { DAYS } from '../../utils/helpers'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function Schedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/schedule').then((res) => setSchedule(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-500 dark:text-slate-400">Loading schedule…</p>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Schedule</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Weekly class schedule.</p>
      </div>

      {schedule.length === 0 ? (
        <EmptyState title="No schedule published yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DAYS.map((day) => {
            const items = schedule.filter((item) => item.day === day)
            const isToday = day === TODAY
            return (
              <div
                key={day}
                className={`rounded-xl border p-4 ${isToday ? 'border-teal-400 bg-teal-50' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
              >
                <h2 className={`mb-3 text-sm font-semibold ${isToday ? 'text-teal-700' : 'text-gray-800 dark:text-slate-100'}`}>
                  {day} {isToday && <span className="ml-1 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-semibold text-white">TODAY</span>}
                </h2>
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-slate-500">No classes.</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-lg bg-white dark:bg-slate-900 px-3 py-2 shadow-sm">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.subject}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{item.teacher?.name ?? 'TBA'}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{item.time} &middot; {item.room ?? 'TBA'}</p>
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
