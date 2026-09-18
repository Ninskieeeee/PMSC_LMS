import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, CheckCircle2 } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { YEAR_LEVELS, formatDate } from '../../utils/helpers'

const EMPTY_FORM = {
  name: '',
  email: '',
  year_level: YEAR_LEVELS[0],
  strand: '',
  address: '',
  guardian_name: '',
  guardian_contact: '',
  date_enrolled: '',
}

export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearLevel, setYearLevel] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [createdInfo, setCreatedInfo] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/admin/students', { params: { search: search || undefined, year_level: yearLevel || undefined } })
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, yearLevel])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(student) {
    setEditing(student)
    setForm({
      name: student.user?.name ?? '',
      email: student.user?.email ?? '',
      year_level: student.year_level,
      strand: student.strand ?? '',
      address: student.address ?? '',
      guardian_name: student.guardian_name ?? '',
      guardian_contact: student.guardian_contact ?? '',
      date_enrolled: student.date_enrolled ? student.date_enrolled.slice(0, 10) : '',
    })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, email: form.email || null, strand: form.strand || null, date_enrolled: form.date_enrolled || null }
      if (editing) {
        await api.put(`/admin/students/${editing.id}`, payload)
        setModalOpen(false)
      } else {
        const { data } = await api.post('/admin/students', payload)
        setModalOpen(false)
        setCreatedInfo(data)
      }
      load()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Unable to save student.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/admin/students/${deleteTarget.id}`)
      setDeleteTarget(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage Students</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Add, edit, or remove student records.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {createdInfo && (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
          <div className="text-sm text-emerald-800">
            <p className="font-medium">Student created successfully.</p>
            <p>
              Access Code: <span className="font-mono font-semibold">{createdInfo.access_code}</span>{' '}
              &middot; Default Password: <span className="font-mono font-semibold">{createdInfo.default_password}</span>
            </p>
          </div>
          <button
            type="button"
            className="ml-auto text-xs font-medium text-emerald-700 hover:underline"
            onClick={() => setCreatedInfo(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or access code…"
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Year Levels</option>
          {YEAR_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800 text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Access Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Year Level</th>
              <th className="px-4 py-3">Strand</th>
              <th className="px-4 py-3">Guardian</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400 dark:text-slate-500">Loading…</td></tr>
            )}
            {!loading && students.length === 0 && (
              <tr><td colSpan={6}><EmptyState title="No students found" message="Try adjusting your search or filters." /></td></tr>
            )}
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-4 py-3 font-mono text-xs">{student.qr_code}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{student.user?.name}</td>
                <td className="px-4 py-3">{student.year_level}</td>
                <td className="px-4 py-3">{student.strand ?? '—'}</td>
                <td className="px-4 py-3">
                  <div>{student.guardian_name ?? '—'}</div>
                  <div className="text-xs text-gray-400 dark:text-slate-500">{student.guardian_contact}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(student)}
                      className="rounded-lg p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(student)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Student' : 'Add Student'}
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" form="student-form" disabled={saving} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Student'}
            </button>
          </>
        }
      >
        <form id="student-form" onSubmit={handleSubmit} className="space-y-3">
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Year Level</label>
              <select required value={form.year_level} onChange={(e) => setForm({ ...form, year_level: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                {YEAR_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Strand (G11-12)</label>
              <input value={form.strand} onChange={(e) => setForm({ ...form, strand: e.target.value })} placeholder="e.g. HUMSS" className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Guardian Name</label>
              <input value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Guardian Contact</label>
              <input value={form.guardian_contact} onChange={(e) => setForm({ ...form, guardian_contact: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Date Enrolled</label>
            <input type="date" value={form.date_enrolled} onChange={(e) => setForm({ ...form, date_enrolled: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          {editing && (
            <p className="text-xs text-gray-400 dark:text-slate-500">Enrolled {formatDate(editing.created_at)}</p>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Student"
        message={`Remove ${deleteTarget?.user?.name}? This will also delete their account, grades, payments, and attendance history.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
