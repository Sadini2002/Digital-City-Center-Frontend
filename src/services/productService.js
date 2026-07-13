import api from "./api";

const getProductsByShop = (shopId) =>
  api.get(`/products/shop/${shopId}`);

export default {
  getProductsByShop,
};