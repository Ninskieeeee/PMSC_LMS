import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, KeyRound, CheckCircle2 } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { ROLES } from '../../utils/helpers'

const STAFF_ROLES = ['admin', 'teacher', 'finance', 'ssg']
const EMPTY_FORM = { name: '', email: '', role: 'teacher' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [resetTarget, setResetTarget] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [createdInfo, setCreatedInfo] = useState(null)
  const [resetInfo, setResetInfo] = useState(null)

  function load() {
    setLoading(true)
    api
      .get('/admin/users', { params: { role: roleFilter || undefined } })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [roleFilter])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(user) {
    setEditing(user)
    setForm({ name: user.name, email: user.email ?? '', role: user.role })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, email: form.email || null }
      if (editing) {
        await api.put(`/admin/users/${editing.id}`, payload)
        setModalOpen(false)
      } else {
        const { data } = await api.post('/admin/users', payload)
        setModalOpen(false)
        setCreatedInfo(data)
      }
      load()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Unable to save user.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/admin/users/${deleteTarget.id}`)
      setDeleteTarget(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  async function handleResetPassword() {
    setResetting(true)
    try {
      const { data } = await api.post(`/admin/users/${resetTarget.id}/reset-password`)
      setResetInfo({ user: resetTarget, ...data })
      setResetTarget(null)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff Users</h1>
          <p className="text-sm text-gray-500">Manage admin, teacher, finance, and SSG accounts.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {createdInfo && (
        <Banner onDismiss={() => setCreatedInfo(null)}>
          <p className="font-medium">User created successfully.</p>
          <p>
            Access Code: <span className="font-mono font-semibold">{createdInfo.access_code}</span>{' '}
            &middot; Temp Password: <span className="font-mono font-semibold">{createdInfo.temp_password}</span>
          </p>
        </Banner>
      )}

      {resetInfo && (
        <Banner onDismiss={() => setResetInfo(null)}>
          <p className="font-medium">Password reset for {resetInfo.user.name}.</p>
          <p>
            New Temp Password: <span className="font-mono font-semibold">{resetInfo.temp_password}</span>
          </p>
        </Banner>
      )}

      <div className="flex gap-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Roles</option>
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role}>{ROLES[role]?.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Access Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5}><EmptyState title="No staff users found" /></td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{user.access_code}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {ROLES[user.role]?.label ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setResetTarget(user)} className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50" aria-label="Reset password">
                      <KeyRound size={15} />
                    </button>
                    <button type="button" onClick={() => openEdit(user)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(user)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
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
        title={editing ? 'Edit Staff User' : 'Add Staff User'}
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="user-form" disabled={saving} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save User'}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-3">
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Role</label>
            <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              {STAFF_ROLES.map((role) => <option key={role} value={role}>{ROLES[role]?.label}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Remove ${deleteTarget?.name}'s account? They will no longer be able to log in.`}
        confirmLabel="Delete"
      />

      <ConfirmDialog
        open={Boolean(resetTarget)}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
        loading={resetting}
        danger={false}
        title="Reset Password"
        message={`Generate a new temporary password for ${resetTarget?.name}?`}
        confirmLabel="Reset Password"
      />
    </div>
  )
}

function Banner({ children, onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
      <div className="text-sm text-emerald-800">{children}</div>
      <button type="button" className="ml-auto text-xs font-medium text-emerald-700 hover:underline" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  )
}
