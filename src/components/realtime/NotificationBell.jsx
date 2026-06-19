import { Bell } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function NotificationBell({ className }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-xl p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary',
        className,
      )}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
    </button>
  )
}
