import { useEffect, useState } from 'react'
import { Users, BookOpen, CalendarDays } from 'lucide-react'
import api from '../../utils/api'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function Overview() {
  const [schedule, setSchedule] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/teacher/schedule'), api.get('/teacher/students')])
      .then(([scheduleRes, studentsRes]) => {
        setSchedule(scheduleRes.data)
        setStudents(studentsRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const todaySchedule = schedule.filter((item) => item.day === TODAY)
  const subjectCount = new Set(schedule.map((item) => item.subject)).size

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Teacher Overview</h1>
        <p className="text-sm text-gray-500">Your teaching load at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Subjects Taught" value={subjectCount} icon={BookOpen} color="blue" />
        <StatCard label="Classes This Week" value={schedule.length} icon={CalendarDays} color="blue" />
        <StatCard label="Students in Scope" value={students.length} icon={Users} color="blue" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">Today's Schedule ({TODAY})</h2>
        {todaySchedule.length === 0 ? (
          <EmptyState title="No classes today" />
        ) : (
          <div className="space-y-2">
            {todaySchedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{item.subject}</p>
                  <p className="text-xs text-gray-500">{item.year_level} &middot; {item.room ?? 'No room set'}</p>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
