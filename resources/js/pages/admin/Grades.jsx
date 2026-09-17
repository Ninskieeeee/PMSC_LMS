import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { YEAR_LEVELS, QUARTERS, getGradeRemarks } from '../../utils/helpers'

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [yearLevel, setYearLevel] = useState('')
  const [quarter, setQuarter] = useState('')

  useEffect(() => {
    setLoading(true)
    api
      .get('/admin/grades', { params: { year_level: yearLevel || undefined, quarter: quarter || undefined } })
      .then((res) => setGrades(res.data))
      .finally(() => setLoading(false))
  }, [yearLevel, quarter])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Grades</h1>
        <p className="text-sm text-gray-500">Read-only view of all recorded grades.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All Year Levels</option>
          {YEAR_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All Quarters</option>
          {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Quarter</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>}
            {!loading && grades.length === 0 && (
              <tr><td colSpan={7}><EmptyState title="No grades found" /></td></tr>
            )}
            {grades.map((grade) => {
              const remark = getGradeRemarks(grade.grade)
              return (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{grade.student?.user?.name}</td>
                  <td className="px-4 py-3">{grade.student?.year_level}</td>
                  <td className="px-4 py-3">{grade.subject}</td>
                  <td className="px-4 py-3">{grade.quarter}</td>
                  <td className="px-4 py-3">{grade.teacher?.name ?? '—'}</td>
                  <td className="px-4 py-3">{grade.grade ?? '—'}</td>
                  <td className="px-4 py-3">
                    {remark.passed === null ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className={remark.passed ? 'font-medium text-emerald-600' : 'font-medium text-red-600'}>
                        {remark.label}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
