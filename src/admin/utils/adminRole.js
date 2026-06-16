export function normalizeAdminRole(role) {
  const raw = String(role ?? '').trim().toUpperCase()
  if (!raw) return null

  // Expected shapes from backend could vary; we accept common strings.
  if (raw.includes('SUPER')) return 'SUPER_ADMIN'
  if (raw.includes('CATEGORY')) return 'CATEGORY_MANAGER'
  if (raw.includes('SUPPORT')) return 'SUPPORT_AGENT'

  // Generic admin fallback
  if (raw === 'ADMIN' || raw.includes('ADMIN')) return 'SUPER_ADMIN'

  return null
}

export function isAdminRole(role) {
  return Boolean(normalizeAdminRole(role))
}

export function getAdminRedirectPath(normalizedRole) {
  const role = normalizedRole ?? normalizeAdminRole(normalizedRole)

  switch (role) {
    case 'CATEGORY_MANAGER':
      return '/admin/categories'
    case 'SUPPORT_AGENT':
      return '/admin/orders'
    case 'SUPER_ADMIN':
    default:
      return '/admin/dashboard'
  }
}

export const ADMIN_ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  CATEGORY_MANAGER: 'Category Manager',
  SUPPORT_AGENT: 'Support Agent',
}

const ADMIN_ROLE_ACCESS = {
  SUPER_ADMIN: ['dashboard', 'sellers', 'categories', 'orders', 'delivery', 'announcements', 'commission', 'reports', 'settings', 'profile'],
  CATEGORY_MANAGER: ['dashboard', 'categories', 'commission', 'reports', 'profile'],
  SUPPORT_AGENT: ['dashboard', 'orders', 'delivery', 'sellers', 'profile'],
}

export function getAdminAllowedSections(role) {
  const normalized = normalizeAdminRole(role)
  if (!normalized) return []
  return ADMIN_ROLE_ACCESS[normalized] ?? []
}

export function canAdminAccessPath(role, pathname) {
  const normalized = normalizeAdminRole(role)
  if (!normalized) return false
  if (!pathname?.startsWith('/admin')) return false

  const section = pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'dashboard'
  return getAdminAllowedSections(normalized).includes(section)
}

