import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import api from '../../utils/api'
import { YEAR_LEVELS } from '../../utils/helpers'

const REPORT_TYPES = [
  { type: 'class_list', label: 'Class List', description: 'Students per year level with access codes.', filename: 'class-list.pdf' },
  { type: 'enrollment', label: 'Enrollment Report', description: 'Enrollment counts grouped by year level.', filename: 'enrollment-report.pdf' },
  { type: 'billing', label: 'Billing Summary', description: 'Fees, payments, and balances per student.', filename: 'billing-summary.pdf' },
  { type: 'attendance', label: 'Attendance Report', description: 'Event attendance logs (landscape).', filename: 'attendance-report.pdf' },
  { type: 'grade_sheet', label: 'Grade Sheet', description: 'Per-student grades with pass/fail remarks.', filename: 'grade-sheet.pdf' },
]

export default function Reports() {
  const [yearLevel, setYearLevel] = useState('')
  const [downloading, setDownloading] = useState(null)
  const [error, setError] = useState('')

  async function download(report) {
    setDownloading(report.type)
    setError('')
    try {
      const response = await api.get(`/admin/reports/${report.type}`, {
        params: { year_level: yearLevel || undefined },
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = report.filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setError(`Unable to generate the ${report.label} report.`)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">Download PDF reports for the school.</p>
      </div>

      <div className="max-w-xs">
        <label className="mb-1 block text-xs font-medium text-gray-600">Year Level Filter (optional)</label>
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All Year Levels</option>
          {YEAR_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((report) => (
          <div key={report.type} className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <FileText size={18} />
              </span>
              <p className="mt-3 font-medium text-gray-900">{report.label}</p>
              <p className="mt-1 text-xs text-gray-500">{report.description}</p>
            </div>
            <button
              type="button"
              onClick={() => download(report)}
              disabled={downloading === report.type}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60"
            >
              <Download size={15} />
              {downloading === report.type ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
