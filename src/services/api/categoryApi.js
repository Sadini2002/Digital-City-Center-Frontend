import { api } from './client'

export const categoryApi = {
  getBySlug: (slug, params = {}) =>
    api.get(
      `/categories/${encodeURIComponent(slug)}`,
      {
        params,
      }
    ),
}