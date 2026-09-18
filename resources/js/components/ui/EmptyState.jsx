import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center dark:border-slate-700">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500">
        <Icon size={22} />
      </span>
      <p className="mt-3 text-sm font-medium text-gray-700 dark:text-slate-300">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-slate-400">{message}</p>}
    </div>
  )
}
