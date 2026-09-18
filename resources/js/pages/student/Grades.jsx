import { useEffect, useState } from 'react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { QUARTERS, getGradeRemarks } from '../../utils/helpers'

const LEGEND = [
  { range: '90–100', label: 'Outstanding', tone: 'text-emerald-600' },
  { range: '85–89', label: 'Very Satisfactory', tone: 'text-emerald-600' },
  { range: '80–84', label: 'Satisfactory', tone: 'text-blue-600' },
  { range: '75–79', label: 'Fairly Satisfactory', tone: 'text-amber-600' },
  { range: 'Below 75', label: 'Did Not Meet Expectations', tone: 'text-red-600' },
]

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [quarter, setQuarter] = useState(QUARTERS[0])

  useEffect(() => {
    api.get('/student/grades').then((res) => setGrades(res.data)).finally(() => setLoading(false))
  }, [])

  const filtered = grades.filter((g) => g.quarter === quarter)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grades</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">View grades by quarter.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUARTERS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuarter(q)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              quarter === q ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No grades for this quarter yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((grade) => {
                const remark = getGradeRemarks(grade.grade)
                return (
                  <tr key={grade.id}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{grade.subject}</td>
                    <td className="px-4 py-3">{grade.grade ?? '—'}</td>
                    <td className="px-4 py-3">
                      {remark.passed === null ? <span className="text-gray-400 dark:text-slate-500">—</span> : (
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
      )}

      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-100">Grading Scale (DepEd)</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">{item.range}</span>
              <span className={`font-medium ${item.tone}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
