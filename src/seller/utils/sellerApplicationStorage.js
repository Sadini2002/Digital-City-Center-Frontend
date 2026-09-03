import { APPLICATION_STATUS } from '../data/sellerConstants'

const APPLICATIONS_KEY = 'dcc_seller_applications'

export function saveSellerApplication(form) {
  const application = {
    id: `APP-${Date.now()}`,
    ...form,
    status: APPLICATION_STATUS.PENDING,
    submittedAt: new Date().toISOString(),
  }

  const list = getSellerApplications()
  list.unshift(application)
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list))
  sessionStorage.setItem('dcc_last_seller_application', JSON.stringify(application))
  return application
}

export function getSellerApplications() {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getLastSellerApplication() {
  try {
    const raw = sessionStorage.getItem('dcc_last_seller_application')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
