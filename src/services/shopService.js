import axios from "axios"

export const getShop = (shopUrl) => {
  return axios.get(`/api/shops/${shopUrl}`)
}

export const getShopProducts = (shopUrl) => {
  return axios.get(`/api/shops/${shopUrl}/products`)
}