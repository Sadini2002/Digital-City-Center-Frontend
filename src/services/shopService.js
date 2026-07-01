import axios from "axios";

const API = "http://localhost:5000/api/v1/shops";

export const getAllShops = () => axios.get(API);

export const getShop = (shopUrl) =>
  axios.get(`${API}/url/${shopUrl}`);

export const getShopProducts = (shopUrl) =>
  axios.get(`${API}/url/${shopUrl}/products`);