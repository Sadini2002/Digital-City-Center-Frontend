import { Bell } from 'lucide-react'

export default function EmptyNotification() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <Bell className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">No notifications yet</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
        New order updates, delivery alerts, and account messages will appear here.
      </p>
    </div>
  )
}
