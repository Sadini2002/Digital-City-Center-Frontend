/**
 * Local mock persistence when the delivery API is unavailable.
 * BACKEND: Remove or gate behind import.meta.env.DEV once all `/api/v1` endpoints exist.
 */

import { normalizeDeliveryStatus } from './deliveryStatus'

const DELIVERIES_KEY = 'dcc_delivery_jobs'
const DRIVERS_KEY = 'dcc_delivery_drivers'
const NOTIFICATIONS_KEY = 'dcc_delivery_notifications'
const TRACKING_KEY = 'dcc_delivery_tracking'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function nowIso() {
  return new Date().toISOString()
}

function seedDeliveries() {
  const t = Date.now()
  return [
    {
      id: 'del-1',
      trackingCode: 'DCC-DLV-1001',
      status: 'CONFIRMED',
      pickupAddress: 'TechZone Electronics, 45 Galle Road, Colombo 03',
      deliveryAddress: '12 Lake Drive, Nugegoda',
      feeAmount: 450,
      order: { orderNumber: 'DCC-58291' },
      assignedDriverId: null,
      createdAt: new Date(t - 3600000).toISOString(),
      statusHistory: [{ id: 'h1', status: 'CONFIRMED', note: 'Job created', createdAt: new Date(t - 3600000).toISOString() }],
    },
    {
      id: 'del-2',
      trackingCode: 'DCC-DLV-1002',
      status: 'CONFIRMED',
      pickupAddress: 'Fashion Hub, Kandy City Center',
      deliveryAddress: '88 Peradeniya Road, Kandy',
      feeAmount: 550,
      order: { orderNumber: 'DCC-41920' },
      assignedDriverId: null,
      createdAt: new Date(t - 7200000).toISOString(),
      statusHistory: [{ id: 'h2', status: 'CONFIRMED', note: 'Job created', createdAt: new Date(t - 7200000).toISOString() }],
    },
    {
      id: 'del-3',
      trackingCode: 'DCC-DLV-0998',
      status: 'PROCESSING',
      pickupAddress: 'Gadget World, Negombo Road, Wattala',
      deliveryAddress: '5 Station Road, Gampaha',
      feeAmount: 400,
      order: { orderNumber: 'DCC-29104' },
      assignedDriverId: 'driver-demo',
      createdAt: new Date(t - 86400000).toISOString(),
      statusHistory: [
        { id: 'h3a', status: 'CONFIRMED', note: 'Job created', createdAt: new Date(t - 90000000).toISOString() },
        { id: 'h3b', status: 'PROCESSING', note: 'Assigned to driver', createdAt: new Date(t - 86400000).toISOString() },
      ],
    },
    {
      id: 'del-4',
      trackingCode: 'DCC-DLV-0995',
      status: 'DELIVERED',
      pickupAddress: 'Home Essentials, Matara',
      deliveryAddress: '22 Beach Road, Galle',
      feeAmount: 600,
      order: { orderNumber: 'DCC-11002' },
      assignedDriverId: 'driver-demo',
      createdAt: new Date(t - 172800000).toISOString(),
      deliveredAt: new Date(t - 86400000).toISOString(),
      statusHistory: [
        { id: 'h4a', status: 'CONFIRMED', note: 'Job created', createdAt: new Date(t - 200000000).toISOString() },
        { id: 'h4b', status: 'DELIVERED', note: 'Delivered to customer', createdAt: new Date(t - 86400000).toISOString() },
      ],
    },
  ]
}

function seedDrivers() {
  return [
    {
      id: 'driver-demo',
      fullName: 'Demo Rider',
      email: 'rider@demo.local',
      phone: '+94 77 555 0101',
      vehicleType: 'Motorcycle',
      vehiclePlate: 'CAB-1234',
      isAvailable: true,
      totalDeliveries: 12,
      status: 'ACTIVE',
    },
    {
      id: 'driver-2',
      fullName: 'Nimal Perera',
      email: 'nimal.rider@swiftx.lk',
      phone: '+94 71 222 3333',
      vehicleType: 'Van',
      vehiclePlate: 'WP-XY-7890',
      isAvailable: false,
      totalDeliveries: 48,
      status: 'ACTIVE',
    },
  ]
}

function seedNotifications() {
  return [
    {
      id: 'dn-1',
      title: 'New pool job',
      body: 'DCC-DLV-1001 is available in Colombo.',
      read: false,
      createdAt: nowIso(),
    },
    {
      id: 'dn-2',
      title: 'Delivery completed',
      body: 'DCC-DLV-0995 marked as delivered.',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]
}

function migrateDeliveryRecord(d) {
  const status = normalizeDeliveryStatus(d.status)
  const statusHistory = (d.statusHistory || []).map((h) => ({
    ...h,
    status: normalizeDeliveryStatus(h.status),
  }))
  return { ...d, status, statusHistory }
}

export function getDeliveries() {
  const existing = readJson(DELIVERIES_KEY, null)
  if (existing?.length) {
    const migrated = existing.map(migrateDeliveryRecord)
    const changed = migrated.some(
      (d, i) =>
        d.status !== existing[i].status ||
        JSON.stringify(d.statusHistory) !== JSON.stringify(existing[i].statusHistory)
    )
    if (changed) writeJson(DELIVERIES_KEY, migrated)
    return migrated
  }
  const seed = seedDeliveries()
  writeJson(DELIVERIES_KEY, seed)
  return seed
}

export function saveDeliveries(list) {
  writeJson(DELIVERIES_KEY, list)
}

export function getDeliveryById(id) {
  return getDeliveries().find((d) => d.id === id) ?? null
}

export function getDrivers() {
  const existing = readJson(DRIVERS_KEY, null)
  if (existing?.length) return existing
  const seed = seedDrivers()
  writeJson(DRIVERS_KEY, seed)
  return seed
}

export function saveDrivers(list) {
  writeJson(DRIVERS_KEY, list)
}

export function getNotifications() {
  const existing = readJson(NOTIFICATIONS_KEY, null)
  if (existing?.length) return existing
  const seed = seedNotifications()
  writeJson(NOTIFICATIONS_KEY, seed)
  return seed
}

export function saveNotifications(list) {
  writeJson(NOTIFICATIONS_KEY, list)
}

export function addDeliveryNotification(title, body) {
  const list = getNotifications()
  const notification = {
    id: `dn-${Date.now()}`,
    title,
    body,
    read: false,
    createdAt: nowIso(),
  }
  list.unshift(notification)
  saveNotifications(list)
  return notification
}

export function getTrackingPoints(deliveryId) {
  const all = readJson(TRACKING_KEY, {})
  return all[deliveryId] || []
}

export function addTrackingPoint(deliveryId, point) {
  const all = readJson(TRACKING_KEY, {})
  const points = all[deliveryId] || []
  points.push({ ...point, recordedAt: nowIso() })
  all[deliveryId] = points.slice(-200)
  writeJson(TRACKING_KEY, all)
  return points
}

export function paginate(items, { page = 1, limit = 10 } = {}) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit
  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, totalPages },
  }
}

export function filterByStatus(items, status) {
  if (!status) return items
  const canonical = normalizeDeliveryStatus(status)
  return items.filter(
    (d) => d.status === status || normalizeDeliveryStatus(d.status) === canonical
  )
}

function isOpenPoolJob(d) {
  return (d.status === 'CONFIRMED' || d.status === 'PENDING') && !d.assignedDriverId
}

export function listPoolDeliveries(params = {}) {
  let items = getDeliveries().filter(isOpenPoolJob)
  items = filterByStatus(items, params.status === '' ? null : params.status)
  return paginate(items, params)
}

export function listAssignedDeliveries(params = {}, _driverId = 'driver-demo') {
  let items = getDeliveries().filter((d) => !isOpenPoolJob(d))
  if (params.status) items = filterByStatus(items, params.status)
  return paginate(items, params)
}

export function acceptDelivery(id, driverId = 'driver-demo') {
  const list = getDeliveries()
  const idx = list.findIndex((d) => d.id === id)
  if (idx < 0) throw new Error('Delivery not found')
  const job = list[idx]
  if (job.status !== 'CONFIRMED' && job.status !== 'PENDING') {
    throw new Error('Job is no longer available')
  }
  const updated = {
    ...job,
    status: 'PROCESSING',
    assignedDriverId: driverId,
    statusHistory: [
      ...(job.statusHistory || []),
      { id: `h-${Date.now()}`, status: 'PROCESSING', note: 'Assigned to driver', createdAt: nowIso() },
    ],
  }
  list[idx] = updated
  saveDeliveries(list)
  addDeliveryNotification(
    'Delivery accepted',
    `${updated.trackingCode} has been assigned to you. Pickup: ${updated.pickupAddress}`,
  )
  return updated
}

export function updateDeliveryStatus(id, payload) {
  const list = getDeliveries()
  const idx = list.findIndex((d) => d.id === id)
  if (idx < 0) throw new Error('Delivery not found')
  const job = list[idx]
  let nextStatus = normalizeDeliveryStatus(payload.status)
  if (payload.status === 'FAILED') nextStatus = 'CANCELLED'
  const updated = {
    ...job,
    status: nextStatus,
    failureReason: payload.failureReason,
    statusHistory: [
      ...(job.statusHistory || []),
      {
        id: `h-${Date.now()}`,
        status: nextStatus,
        note: payload.failureReason || payload.note || `Status → ${nextStatus}`,
        createdAt: nowIso(),
      },
    ],
  }
  if (nextStatus === 'DELIVERED') updated.deliveredAt = nowIso()
  if (payload.latitude != null) {
    addTrackingPoint(id, {
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy,
    })
  }
  list[idx] = updated
  saveDeliveries(list)
  return updated
}

export function getDashboardStats() {
  const all = getDeliveries()
  const today = new Date().toDateString()
  return {
    stats: {
      pending: all.filter((d) => d.status === 'CONFIRMED' && !d.assignedDriverId).length,
      active: all.filter((d) => ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status)).length,
      deliveredToday: all.filter(
        (d) => d.status === 'DELIVERED' && d.deliveredAt && new Date(d.deliveredAt).toDateString() === today
      ).length,
    },
    recentDeliveries: all
      .filter((d) => !(d.status === 'CONFIRMED' && !d.assignedDriverId))
      .slice(0, 5)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  }
}

export function getEarnings({ days = 30 } = {}) {
  const cutoff = Date.now() - days * 86400000
  const completed = getDeliveries().filter(
    (d) => d.status === 'DELIVERED' && new Date(d.deliveredAt || d.createdAt).getTime() >= cutoff
  )
  const totalEarnings = completed.reduce((sum, d) => sum + (d.feeAmount || 0), 0)
  const chart = Array.from({ length: Math.min(days, 14) }, (_, i) => {
    const day = new Date()
    day.setDate(day.getDate() - (13 - i))
    const key = day.toISOString().slice(0, 10)
    const dayJobs = completed.filter((d) => (d.deliveredAt || d.createdAt).slice(0, 10) === key)
    return { date: key, earnings: dayJobs.reduce((s, d) => s + (d.feeAmount || 0), 0) }
  })
  return { totalEarnings, totalDeliveries: completed.length, chart }
}

export function getAnalytics({ days = 30 } = {}) {
  const all = getDeliveries()
  const completed = all.filter((d) => d.status === 'DELIVERED').length
  const failed = all.filter((d) => d.status === 'CANCELLED').length
  const total = completed + failed || 1
  const byStatus = ['DELIVERED', 'CANCELLED', 'PROCESSING', 'CONFIRMED', 'DISPATCHED', 'OUT_FOR_DELIVERY'].map(
    (status) => ({
      status,
      count: all.filter((d) => d.status === status).length,
    })
  )
  return {
    completed,
    failed,
    successRate: Math.round((completed / total) * 100),
    avgDeliveryMinutes: 42,
    byStatus: byStatus.filter((r) => r.count > 0),
  }
}

export function createDriver(payload) {
  const list = getDrivers()
  const driver = {
    id: `driver-${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    vehicleType: payload.vehicleType || 'Motorcycle',
    vehiclePlate: payload.vehiclePlate || '',
    licenseNo: payload.licenseNo,
    isAvailable: true,
    totalDeliveries: 0,
    status: 'ACTIVE',
  }
  list.unshift(driver)
  saveDrivers(list)
  return driver
}

export function updateDriver(id, payload) {
  const list = getDrivers()
  const idx = list.findIndex((d) => d.id === id)
  if (idx < 0) throw new Error('Driver not found')
  list[idx] = { ...list[idx], ...payload }
  saveDrivers(list)
  return list[idx]
}

const TIMELINE_LABELS = {
  CONFIRMED: 'Order confirmed',
  PROCESSING: 'Processing',
  DISPATCHED: 'Dispatched',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export function buildTimelineFromDelivery(delivery) {
  const order = ['CONFIRMED', 'PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED']
  const current = delivery?.status
  const history = delivery?.statusHistory || []
  return order.map((status) => {
    const hit = history.find((h) => h.status === status)
    const idx = order.indexOf(status)
    const curIdx = order.indexOf(current)
    return {
      status,
      label: TIMELINE_LABELS[status] || status,
      done: curIdx > idx || current === 'DELIVERED',
      current: status === current,
      timestamp: hit?.createdAt,
      note: hit?.note,
    }
  })
}

/** Mock coords for map embed (Colombo area) — BACKEND: return pickup/dropoff lat/lng from API */
function mockGeoForDelivery(d) {
  const base = 6.9271
  const lng = 79.8612
  const offset = (d.id?.charCodeAt(d.id.length - 1) || 0) * 0.002
  return {
    pickup: { latitude: base + offset, longitude: lng, label: d.pickupAddress },
    dropoff: { latitude: base + offset + 0.03, longitude: lng + 0.04, label: d.deliveryAddress },
  }
}

export function trackPublic(trackingCode) {
  const code = String(trackingCode || '').trim().toUpperCase()
  const d = getDeliveries().find((x) => x.trackingCode?.toUpperCase() === code)
  if (!d) throw new Error('Tracking not found')
  const route = getTrackingPoints(d.id)
  const geo = mockGeoForDelivery(d)
  const last = route[route.length - 1]
  return {
    ...d,
    ...geo,
    timeline: buildTimelineFromDelivery(d),
    route,
    location: last
      ? { latitude: last.latitude, longitude: last.longitude, recordedAt: last.recordedAt }
      : null,
    etaMinutes: d.status === 'OUT_FOR_DELIVERY' ? 18 : null,
    distanceRemainingKm: d.status === 'OUT_FOR_DELIVERY' ? 4.2 : null,
    driver: d.assignedDriverId
      ? getDrivers().find((dr) => dr.id === d.assignedDriverId) || { fullName: 'Assigned driver' }
      : null,
  }
}

/** BACKEND: `GET /tracking/delivery/:id` — live snapshot for driver portal */
export function getDeliveryLive(id) {
  const d = getDeliveryById(id)
  if (!d) throw new Error('Delivery not found')
  const route = getTrackingPoints(id)
  const geo = mockGeoForDelivery(d)
  const last = route[route.length - 1]
  return {
    ...d,
    pickup: geo.pickup,
    dropoff: geo.dropoff,
    timeline: buildTimelineFromDelivery(d),
    route,
    location: last
      ? { latitude: last.latitude, longitude: last.longitude, recordedAt: last.recordedAt }
      : null,
    etaMinutes: ['DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status) ? 22 : null,
    distanceRemainingKm: d.status === 'OUT_FOR_DELIVERY' ? 5.1 : null,
  }
}

export function addTrackingBatch(deliveryId, points) {
  if (!Array.isArray(points)) return []
  points.forEach((p) => addTrackingPoint(deliveryId, p))
  return getTrackingPoints(deliveryId)
}

export function getUnreadNotificationCount() {
  return getNotifications().filter((n) => !n.read).length
}

export function listNotifications(params = {}) {
  const page = params.page || 1
  const limit = params.limit || 20
  return paginate(getNotifications(), { page, limit })
}

export function markNotificationRead(id) {
  const list = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n))
  saveNotifications(list)
  return list.find((n) => n.id === id)
}

export function markAllNotificationsRead() {
  const list = getNotifications().map((n) => ({ ...n, read: true }))
  saveNotifications(list)
  return list
}

export function deleteNotification(id) {
  const list = getNotifications().filter((n) => n.id !== id)
  saveNotifications(list)
  return { ok: true }
}

function currentDriverId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user?.deliveryDriver?.id || user?.id || 'driver-demo'
  } catch {
    return 'driver-demo'
  }
}

export function acceptDeliveryForCurrentDriver(id) {
  return acceptDelivery(id, currentDriverId())
}

function findDeliveryForOrder(orderId) {
  const code = String(orderId || '').trim()
  return (
    getDeliveries().find(
      (d) =>
        d.order?.orderNumber === code ||
        d.order?.id === code ||
        d.id === code
    ) ?? getDeliveries().find((d) => d.status === 'OUT_FOR_DELIVERY') ??
    getDeliveries()[0]
  )
}

/** BACKEND: GET /tracking/order/:orderId — buyer order tracking page */
export function trackOrderLive(orderId) {
  const delivery = findDeliveryForOrder(orderId)
  if (!delivery) {
    return { orderId, delivery: null, message: 'No delivery assigned yet' }
  }
  const live = getDeliveryLive(delivery.id)
  return {
    orderId,
    subOrders: [],
    delivery: live,
    trackingCode: live.trackingCode,
  }
}

/** BACKEND: GET /tracking/sub-order/:subOrderId — multi-seller checkout */
export function trackSubOrderLive(subOrderId) {
  const parentId = String(subOrderId || '').replace(/-sub-\d+$/, '')
  const base = trackOrderLive(parentId)
  return {
    ...base,
    subOrderId,
    subOrder: {
      id: subOrderId,
      status: base.delivery?.status,
      sellerName: 'Demo seller',
    },
  }
}

export function registerProviderMock(payload) {
  return {
    token: 'mock-token',
    user: {
      id: 'provider-demo',
      name: payload.fullName || payload.companyName,
      email: payload.email,
      role: 'DELIVERY_PROVIDER',
      deliveryProvider: { companyName: payload.companyName, status: 'PENDING' },
    },
  }
}

export function getProviderProfileMock() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.deliveryProvider ?? user
  } catch {
    return {}
  }
}

export function updateProviderProfileMock(payload) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const updated = {
      ...user,
      deliveryProvider: { ...user.deliveryProvider, ...payload },
      deliveryDriver: user.deliveryDriver
        ? { ...user.deliveryDriver, ...payload }
        : user.deliveryDriver,
    }
    localStorage.setItem('user', JSON.stringify(updated))
    return updated.deliveryProvider ?? updated.deliveryDriver
  } catch {
    return payload
  }
}

const DELIVERY_STATUSES_FOR_MOCK = [
  'CONFIRMED',
  'PROCESSING',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

export function getDeliveriesStatusMock() {
  const all = getDeliveries()
  return {
    stats: {
      pending: all.filter((d) => d.status === 'CONFIRMED' && !d.assignedDriverId).length,
      active: all.filter((d) => ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status)).length,
      deliveredToday: all.filter((d) => d.status === 'DELIVERED').length,
    },
    byStatus: DELIVERY_STATUSES_FOR_MOCK.map((status) => ({
      status,
      count: all.filter((d) => d.status === status).length,
    })).filter((r) => r.count > 0),
  }
}

export function getDeliveriesHistoryMock({ days = 30 } = {}) {
  const cutoff = Date.now() - days * 86400000
  const items = getDeliveries().filter(
    (d) => new Date(d.deliveredAt || d.createdAt).getTime() >= cutoff
  )
  return { items, analytics: getAnalytics({ days }) }
}
