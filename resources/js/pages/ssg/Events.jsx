import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, CalendarDays } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, formatDateTime } from '../../utils/helpers'

const EMPTY_FORM = { name: '', description: '', date: '' }

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  function load() {
    setLoading(true)
    api.get('/ssg/events').then((res) => setEvents(res.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleExpand(event) {
    if (expanded === event.id) {
      setExpanded(null)
      return
    }
    setExpanded(event.id)
    if (!attendance[event.id]) {
      setAttendanceLoading(true)
      try {
        const { data } = await api.get(`/ssg/events/${event.id}/attendance`)
        setAttendance((prev) => ({ ...prev, [event.id]: data }))
      } finally {
        setAttendanceLoading(false)
      }
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await api.post('/ssg/events', form)
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Unable to create event.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/ssg/events/${deleteTarget.id}`)
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Create and manage school events.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus size={16} /> New Event
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400 dark:text-slate-500">Loading…</p>}
      {!loading && events.length === 0 && <EmptyState icon={CalendarDays} title="No events yet" />}

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between px-4 py-3">
              <button type="button" onClick={() => toggleExpand(event)} className="flex flex-1 items-center justify-between text-left">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{event.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{formatDate(event.date)} &middot; {event.attendance_count} attendee(s)</p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setDeleteTarget(event)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete event">
                  <Trash2 size={15} />
                </button>
                <button type="button" onClick={() => toggleExpand(event)} className="rounded-lg p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700">
                  {expanded === event.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {expanded === event.id && (
              <div className="border-t border-gray-100 dark:border-slate-800 px-4 py-3">
                {event.description && <p className="mb-3 text-sm text-gray-500 dark:text-slate-400">{event.description}</p>}
                {attendanceLoading && !attendance[event.id] && <p className="text-sm text-gray-400 dark:text-slate-500">Loading attendance…</p>}
                {attendance[event.id] && attendance[event.id].length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500">No attendees yet.</p>}
                {attendance[event.id] && attendance[event.id].length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
                      <tr>
                        <th className="py-2">Student</th>
                        <th className="py-2">Access Code</th>
                        <th className="py-2">Scanned At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {attendance[event.id].map((record) => (
                        <tr key={record.id}>
                          <td className="py-2 font-medium text-gray-900 dark:text-white">{record.student?.user?.name}</td>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Event"
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" form="event-form" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
              {saving ? 'Saving…' : 'Create Event'}
            </button>
          </>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="space-y-3">
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Event Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Event"
        message={`Delete "${deleteTarget?.name}"? Attendance records for this event will also be removed.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
