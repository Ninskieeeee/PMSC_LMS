import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/auth/LoginPage'
import LandingPage from './pages/LandingPage'

import AdminOverview from './pages/admin/Overview'
import ManageStudents from './pages/admin/ManageStudents'
import ManageUsers from './pages/admin/ManageUsers'
import AdminGrades from './pages/admin/Grades'
import AdminPayments from './pages/admin/Payments'
import AdminEvents from './pages/admin/Events'
import AdminReports from './pages/admin/Reports'

import TeacherOverview from './pages/teacher/Overview'
import TeacherGrades from './pages/teacher/Grades'
import TeacherSchedule from './pages/teacher/Schedule'

import FinanceOverview from './pages/finance/Overview'
import FinancePayments from './pages/finance/Payments'

import SsgOverview from './pages/ssg/Overview'
import SsgEvents from './pages/ssg/Events'
import SsgScanner from './pages/ssg/Scanner'
import SsgAttendance from './pages/ssg/Attendance'

import StudentOverview from './pages/student/Overview'
import StudentGrades from './pages/student/Grades'
import StudentSchedule from './pages/student/Schedule'
import StudentPayments from './pages/student/Payments'
import StudentQr from './pages/student/Qr'
import StudentEvents from './pages/student/Events'

const DASHBOARD_BY_ROLE = {
  admin: '/admin',
  teacher: '/teacher',
  finance: '/finance',
  ssg: '/ssg',
  student: '/student',
  parent: '/student',
}

function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={DASHBOARD_BY_ROLE[role] ?? '/login'} replace />
  }

  return children
}

function RootRoute() {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <LandingPage />
  return <Navigate to={DASHBOARD_BY_ROLE[role] ?? '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRoute />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="grades" element={<AdminGrades />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherOverview />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="schedule" element={<TeacherSchedule />} />
      </Route>

      <Route
        path="/finance"
        element={
          <ProtectedRoute allowedRoles={['finance']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FinanceOverview />} />
        <Route path="payments" element={<FinancePayments />} />
      </Route>

      <Route
        path="/ssg"
        element={
          <ProtectedRoute allowedRoles={['ssg']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SsgOverview />} />
        <Route path="events" element={<SsgEvents />} />
        <Route path="scanner" element={<SsgScanner />} />
        <Route path="attendance" element={<SsgAttendance />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'parent']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="qr" element={<StudentQr />} />
        <Route path="events" element={<StudentEvents />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
