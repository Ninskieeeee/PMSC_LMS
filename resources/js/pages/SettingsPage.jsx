import { useRef, useState } from 'react'
import { Camera, Trash2, Sun, Moon, Monitor, Lock, Save } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { initials, ROLES } from '../utils/helpers'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function SettingsPage() {
  const { user, role, updateUser } = useAuth()
  const { preference, effective, setPreference } = useTheme()
  const fileInputRef = useRef(null)

  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    address: user?.address ?? '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileSaving(true)
    setProfileMessage('')
    setProfileError('')
    try {
      const { data } = await api.put('/profile', profileForm)
      updateUser(data.user)
      setProfileMessage('Profile updated.')
    } catch (err) {
      setProfileError(err.response?.data?.message ?? 'Unable to update profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarUploading(true)
    setAvatarError('')
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const { data } = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateUser(data.user)
    } catch (err) {
      setAvatarError(err.response?.data?.errors?.avatar?.[0] ?? 'Unable to upload photo.')
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleAvatarRemove() {
    setAvatarUploading(true)
    setAvatarError('')
    try {
      const { data } = await api.delete('/profile/avatar')
      updateUser(data.user)
    } catch {
      setAvatarError('Unable to remove photo.')
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordSaving(true)
    setPasswordMessage('')
    setPasswordError('')
    try {
      await api.put('/profile/password', passwordForm)
      setPasswordMessage('Password updated.')
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      setPasswordError(
        err.response?.data?.errors?.current_password?.[0] ??
          err.response?.data?.errors?.password?.[0] ??
          'Unable to update password.',
      )
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Manage your {ROLES[role]?.label ?? role} account.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-100">Profile</h2>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-lg font-semibold text-white">
                {initials(user?.name)}
              </span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white shadow ring-2 ring-white hover:bg-blue-800 disabled:opacity-60 dark:ring-slate-900"
              aria-label="Upload photo"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
              {avatarUploading ? 'Uploading…' : 'Profile photo'}
            </p>
            {user?.avatar_url && (
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={avatarUploading}
                className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-60"
              >
                <Trash2 size={12} /> Remove photo
              </button>
            )}
            {avatarError && <p className="mt-1 text-xs text-red-600">{avatarError}</p>}
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="settings-name" className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
              Full Name
            </label>
            <input
              id="settings-name"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="settings-address" className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
              Address
            </label>
            <input
              id="settings-address"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              placeholder="e.g. Poblacion, Clarin, Bohol"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {profileError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{profileError}</p>}
          {profileMessage && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{profileMessage}</p>}

          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <Save size={15} /> {profileSaving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-slate-100">
          <Lock size={15} /> Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="current-password" className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              required
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">Min 8 characters, at least 1 uppercase letter and 1 number.</p>

          {passwordError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{passwordError}</p>}
          {passwordMessage && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{passwordMessage}</p>}

          <button
            type="submit"
            disabled={passwordSaving}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <Save size={15} /> {passwordSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-100">Appearance</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          System follows a fixed schedule: dark from 6 AM–6 PM, light from 6 PM–6 AM.
          {preference === 'system' && (
            <> Currently showing <span className="font-medium">{effective}</span> mode.</>
          )}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
                preference === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <option.icon size={18} />
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
