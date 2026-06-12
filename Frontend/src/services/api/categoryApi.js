import { api } from './client'

// GET /categories — returns all active categories
export const categoryApi = {
  getAll: () => api.get('/categories'),

  // GET /categories/:slug — with optional filter/sort query params
  getBySlug: (slug, params = {}) => {
    // params: { minPrice, maxPrice, minRating, sort, page, limit }
    return api.get(`/categories/${slug}`, { params })
  },
}
