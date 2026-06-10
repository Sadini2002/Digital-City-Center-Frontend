import { api } from './client'

export const healthApi = {
  check: () => api.get('/health'),
}

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  registerSeller: (payload) => api.post('/auth/register/seller', payload),
  registerDeliveryProvider: (payload) => api.post('/delivery-providers/register', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  googleSignIn: () => api.post('/auth/google-signin'),
}

export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (payload) => api.put('/users/profile', payload),
}

export const shopsApi = {
  getShopByName: (shopname) => api.get(`/shops/${shopname}`),
  getAllShops: () => api.get('/shops'),
}

export const listingsApi = {
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  getRelatedListings: (id) => api.get(`/listings/${id}/related`),
}

export const categoriesApi = {
  getCategories: () => api.get('/categories'),
}

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (payload) => api.post('/cart/items', payload),
  updateCartItem: (itemId, payload) => api.put(`/cart/items/${itemId}`, payload),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
}

export const checkoutApi = {
  checkout: (payload) => api.post('/checkout', payload),
}

export const ordersApi = {
  getOrderById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders'),
  submitReview: (orderId, payload) => api.post(`/orders/${orderId}/reviews`, payload),
}

export const sellerApi = {
  getDashboard: () => api.get('/seller/dashboard'),
  getListings: () => api.get('/seller/listings'),
  addListing: (payload) => api.post('/seller/listings', payload),
  updateListing: (id, payload) => api.put(`/seller/listings/${id}`, payload),
  deleteListing: (id) => api.delete(`/seller/listings/${id}`),
  getOrders: () => api.get('/seller/orders'),
  updateOrderStatus: (id, status) => api.patch(`/seller/orders/${id}/status`, { status }),
  getEarnings: () => api.get('/seller/earnings'),
  updateSettings: (payload) => api.put('/seller/settings', payload),
}

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSellers: () => api.get('/admin/sellers'),
  updateSellerStatus: (id, status) => api.patch(`/admin/sellers/${id}/status`, { status }),
  getCategories: () => api.get('/admin/categories'),
  addCategory: (payload) => api.post('/admin/categories', payload),
  updateCategory: (id, payload) => api.put(`/admin/categories/${id}`, payload),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderDispute: (id, payload) => api.patch(`/admin/orders/${id}/dispute`, payload),
  getDeliveryProviders: () => api.get('/admin/delivery'),
  updateDeliveryProviderStatus: (id, status) => api.patch(`/admin/delivery/${id}/status`, { status }),
  getAnnouncements: () => api.get('/admin/announcements'),
  addAnnouncement: (payload) => api.post('/admin/announcements', payload),
  updateAnnouncement: (id, payload) => api.put(`/admin/announcements/${id}`, payload),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
  getReports: () => api.get('/admin/reports'),
  updateSettings: (payload) => api.put('/admin/settings', payload),
}

export const deliveryApi = {
  register: (payload) => api.post('/delivery-providers/register', payload),
  getDashboard: () => api.get('/delivery/dashboard'),
  getDeliveries: () => api.get('/delivery/deliveries'),
  getDeliveryDetails: (id) => api.get(`/delivery/deliveries/${id}`),
  updateDeliveryStatus: (id, payload) => api.patch(`/delivery/deliveries/${id}/status`, payload),
  getEarnings: () => api.get('/delivery/earnings'),
  getAnalytics: () => api.get('/delivery/analytics'),
  getDrivers: () => api.get('/delivery/drivers'),
  addDriver: (payload) => api.post('/delivery/drivers', payload),
  getSettings: () => api.get('/delivery/settings'),
  updateSettings: (payload) => api.put('/delivery/settings', payload),
}

