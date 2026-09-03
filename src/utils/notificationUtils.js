export function formatNotificationTime(createdAt) {
  if (!createdAt) return ''

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

export function getNotificationTone(type) {
  switch (String(type).toUpperCase()) {
    case "PAYMENT":
      return "success";

    case "ORDER":
      return "info";

    case "DELIVERY":
      return "success";

    case "CART":
      return "info";

    case "SELLER":
      return "success";

    case "REVIEW":
      return "warning";

    case "PROMOTION":
      return "warning";

    case "ACCOUNT":
      return "info";

    default:
      return "info";
  }
}
