export function isJwtStructurallyValid(token) {
  if (!token || typeof token !== 'string') {
    return false
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    return false
  }

  try {
    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      )
    )

    if (
      payload.exp &&
      typeof payload.exp === 'number' &&
      payload.exp * 1000 < Date.now()
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}