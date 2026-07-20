import api from "./api";

const getShopBySlug = (slug) =>
  api.get(`/shops/url/${slug}`);

export const toggleFavouriteShop = (id) =>
  api.post(`/shops/${id}/favourite`);

export const getFavouriteStatus = (id) =>
  api.get(`/shops/${id}/favourite`);

export const getFavouriteCount = (id) =>
  api.get(`/shops/${id}/favourites/count`);

export default {
  getShopBySlug,
  toggleFavouriteShop,
  getFavouriteStatus,
  getFavouriteCount,
};