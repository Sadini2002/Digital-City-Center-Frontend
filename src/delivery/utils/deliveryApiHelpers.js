import { api } from '../../services/api/client'

export function unwrap(response) {
  const body = response?.data
  return body?.data ?? body
}

export function unwrapMeta(response) {
  const body = response?.data
  if (body?.data != null && body?.meta != null) {
    return { data: body.data, meta: body.meta }
  }
  if (Array.isArray(body?.data)) {
    return {
      data: body.data,
      meta: body.meta ?? { page: 1, totalPages: 1, total: body.data.length },
    }
  }
  if (Array.isArray(body)) {
    return { data: body, meta: { page: 1, totalPages: 1, total: body.length } }
  }
  return body
}

export function toListMeta(raw, params = {}) {
  if (raw?.data && raw?.meta) return raw
  const list = Array.isArray(raw) ? raw : raw?.items ?? raw?.jobs ?? raw?.deliveries ?? []
  const page = params.page || 1
  const limit = params.limit || 10
  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  return {
    data: list.slice(start, start + limit),
    meta: { page, totalPages, total },
  }
}

export async function tryApi(fn, fallback) {
  try {
    return await fn()
  } catch {
    return fallback()
  }
}

export function getDriverId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user?.deliveryDriver?.id || user?.id || 'driver-demo'
  } catch {
    return 'driver-demo'
  }
}

export { api }
