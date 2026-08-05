export default function NotificationBadge({ count }) {
  if (!count) return null

  return (
    <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
