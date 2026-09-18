const COLOR_MAP = {
  navy: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
}

export default function StatCard({ label, value, icon: Icon, color = 'blue', sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${COLOR_MAP[color] ?? COLOR_MAP.blue}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{sub}</p>}
    </div>
  )
}
