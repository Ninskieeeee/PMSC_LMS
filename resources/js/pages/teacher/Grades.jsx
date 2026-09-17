import { useEffect, useMemo, useState } from 'react'
import { Save, Download } from 'lucide-react'
import api from '../../utils/api'
import EmptyState from '../../components/ui/EmptyState'
import { YEAR_LEVELS, QUARTERS, getGradeRemarks } from '../../utils/helpers'

export default function Grades() {
  const [schedule, setSchedule] = useState([])
  const [yearLevel, setYearLevel] = useState('')
  const [subject, setSubject] = useState('')
  const [quarter, setQuarter] = useState(QUARTERS[0])
  const [students, setStudents] = useState([])
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/teacher/schedule').then((res) => setSchedule(res.data))
  }, [])

  const subjectOptions = useMemo(() => {
    const subjects = schedule.filter((item) => !yearLevel || item.year_level === yearLevel).map((item) => item.subject)
    return [...new Set(subjects)]
  }, [schedule, yearLevel])

  useEffect(() => {
    if (!yearLevel || !subject || !quarter) {
      setStudents([])
      return
    }

    setLoading(true)
    Promise.all([
      api.get('/teacher/students', { params: { year_level: yearLevel } }),
      api.get('/teacher/grades', { params: { year_level: yearLevel, subject, quarter } }),
    ])
      .then(([studentsRes, gradesRes]) => {
        setStudents(studentsRes.data)
        const nextValues = {}
        studentsRes.data.forEach((student) => {
          const existing = gradesRes.data.find((g) => g.student_id === student.id)
          nextValues[student.id] = existing?.grade ?? ''
        })
        setValues(nextValues)
      })
      .finally(() => setLoading(false))
  }, [yearLevel, subject, quarter])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      await api.post('/teacher/grades/bulk', {
        subject,
        quarter,
        grades: students.map((student) => ({
          student_id: student.id,
          grade: values[student.id] === '' ? null : Number(values[student.id]),
        })),
      })
      setMessage('Grades saved successfully.')
    } catch {
      setMessage('Unable to save grades.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const response = await api.get('/teacher/grades/pdf', {
        params: { year_level: yearLevel || undefined, subject: subject || undefined, quarter: quarter || undefined },
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'grade-sheet.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grades</h1>
          <p className="text-sm text-gray-500">Enter and update grades per subject and quarter.</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <Download size={15} /> {downloading ? 'Preparing…' : 'Download PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select value={yearLevel} onChange={(e) => { setYearLevel(e.target.value); setSubject('') }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">Select Year Level</option>
          {YEAR_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!yearLevel} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100">
          <option value="">Select Subject</option>
          {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      {message && (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{message}</p>
      )}

      {!yearLevel || !subject ? (
        <EmptyState title="Select a year level and subject" message="Choose filters above to load the class roster." />
      ) : loading ? (
        <p className="text-sm text-gray-500">Loading roster…</p>
      ) : students.length === 0 ? (
        <EmptyState title="No students in this year level" />
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Access Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 w-32">Grade</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const remark = getGradeRemarks(values[student.id])
                  return (
                    <tr key={student.id}>
                      <td className="px-4 py-3 font-mono text-xs">{student.qr_code}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{student.user?.name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={values[student.id] ?? ''}
                          onChange={(e) => setValues({ ...values, [student.id]: e.target.value })}
                          className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
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

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? 'Saving…' : 'Save Grades'}
          </button>
        </div>
      )}
    </div>
  )
}
