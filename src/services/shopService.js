import api from "./api";

const getShopBySlug = (slug) =>
  api.get(`/shops/${slug}`);

export default {
  getShopBySlug,
};