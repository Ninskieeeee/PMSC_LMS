import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  Calendar,
  FileText,
  QrCode,
  ScanLine,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Menu,
  X,
  LogOut,
  UserCog,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLES, initials } from '../../utils/helpers'

const THEME = {
  admin: {
    active: 'bg-slate-800 text-white',
    hover: 'hover:bg-slate-100',
    header: 'bg-slate-900',
    badge: 'bg-slate-700 text-white',
  },
  teacher: {
    active: 'bg-blue-600 text-white',
    hover: 'hover:bg-blue-50',
    header: 'bg-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  finance: {
    active: 'bg-amber-600 text-white',
    hover: 'hover:bg-amber-50',
    header: 'bg-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  ssg: {
    active: 'bg-emerald-600 text-white',
    hover: 'hover:bg-emerald-50',
    header: 'bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  student: {
    active: 'bg-teal-600 text-white',
    hover: 'hover:bg-teal-50',
    header: 'bg-teal-700',
    badge: 'bg-teal-100 text-teal-700',
  },
  parent: {
    active: 'bg-teal-600 text-white',
    hover: 'hover:bg-teal-50',
    header: 'bg-teal-700',
    badge: 'bg-teal-100 text-teal-700',
  },
}

function getNavItems(role) {
  switch (role) {
    case 'admin':
      return [
        { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/admin/students', label: 'Students', icon: GraduationCap },
        { to: '/admin/users', label: 'Staff Users', icon: UserCog },
        { to: '/admin/grades', label: 'Grades', icon: BookOpen },
        { to: '/admin/payments', label: 'Payments', icon: Wallet },
        { to: '/admin/events', label: 'Events', icon: Calendar },
        { to: '/admin/reports', label: 'Reports', icon: FileText },
      ]
    case 'teacher':
      return [
        { to: '/teacher', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/teacher/grades', label: 'Grades', icon: BookOpen },
        { to: '/teacher/schedule', label: 'Schedule', icon: CalendarDays },
      ]
    case 'finance':
      return [
        { to: '/finance', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/finance/payments', label: 'Payments', icon: Wallet },
      ]
    case 'ssg':
      return [
        { to: '/ssg', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/ssg/events', label: 'Events', icon: Calendar },
        { to: '/ssg/scanner', label: 'Scanner', icon: ScanLine },
        { to: '/ssg/attendance', label: 'Attendance', icon: ClipboardList },
      ]
    case 'student':
    case 'parent':
      return [
        { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/student/grades', label: 'Grades', icon: BookOpen },
        { to: '/student/schedule', label: 'Schedule', icon: CalendarDays },
        { to: '/student/payments', label: 'Payments', icon: Wallet },
        ...(role !== 'parent' ? [{ to: '/student/qr', label: 'My QR Code', icon: QrCode }] : []),
        { to: '/student/events', label: 'Events', icon: Calendar },
      ]
    default:
      return []
  }
}

export default function DashboardLayout() {
  const { user, role, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const theme = THEME[role] ?? THEME.admin
  const navItems = getNavItems(role)
  const roleLabel = ROLES[role]?.label ?? role

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-200
          ${collapsed ? 'md:w-20' : 'md:w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <span className="truncate text-sm font-bold text-gray-800">PMSC Clarin</span>
          )}
          <button
            type="button"
            className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 md:block"
            onClick={() => setCollapsed((value) => !value)}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? theme.active : `text-gray-600 ${theme.hover}`
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex flex-1 flex-col transition-all duration-200 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <header className={`sticky top-0 z-20 flex h-16 items-center justify-between px-4 text-white shadow-sm ${theme.header}`}>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <span className="hidden text-sm font-semibold md:block">
            {roleLabel} Portal
          </span>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user?.name}</p>
              <p className="text-xs text-white/70 leading-tight font-mono">{user?.access_code}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {initials(user?.name)}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
