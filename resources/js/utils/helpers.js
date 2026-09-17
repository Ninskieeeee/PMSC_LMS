export const YEAR_LEVELS = [
  'Pre-Kindergarten',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
]

export const QUARTERS = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter']

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const ROLES = {
  admin: { label: 'Admin', color: 'navy' },
  teacher: { label: 'Teacher', color: 'blue' },
  finance: { label: 'Finance', color: 'amber' },
  ssg: { label: 'SSG Officer', color: 'green' },
  student: { label: 'Student', color: 'teal' },
  parent: { label: 'Parent', color: 'teal' },
}

export function formatCurrency(value) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value, options) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(
    'en-US',
    options ?? { year: 'numeric', month: 'short', day: 'numeric' },
  )
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// DepEd K-12 grading scale.
export function getGradeRemarks(grade) {
  if (grade === null || grade === undefined || grade === '') {
    return { label: 'No Grade', passed: null, tone: 'gray' }
  }

  const value = Number(grade)

  if (value >= 90) return { label: 'Outstanding', passed: true, tone: 'green' }
  if (value >= 85) return { label: 'Very Satisfactory', passed: true, tone: 'green' }
  if (value >= 80) return { label: 'Satisfactory', passed: true, tone: 'blue' }
  if (value >= 75) return { label: 'Fairly Satisfactory', passed: true, tone: 'amber' }
  return { label: 'Did Not Meet Expectations', passed: false, tone: 'red' }
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
