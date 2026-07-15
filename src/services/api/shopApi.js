import api from "./axios";

/*
|--------------------------------------------------------------------------
| Shop API
|--------------------------------------------------------------------------
*/

export const shopApi = {
  // Get all shops
  getAll: () => api.get("/shops"),

  // Search shops
  search: (query) =>
    api.get(`/shops/search?q=${encodeURIComponent(query)}`),

  // Get shop details by slug/url
  getByUrl: (shopUrl) =>
    api.get(`/shops/url/${shopUrl}`),

  // Get products of a shop
  getProductsByUrl: (shopUrl) =>
    api.get(`/shops/url/${shopUrl}/products`),

  // Favourite APIs
  toggleFavourite: (shopId) =>
    api.post(`/shops/${shopId}/favourite`),

  getFavouriteStatus: (shopId) =>
    api.get(`/shops/${shopId}/favourite`),

  getFavouriteCount: (shopId) =>
    api.get(`/shops/${shopId}/favourites/count`),

  // Get shop by ID
  getById: (id) =>
    api.get(`/shops/${id}`),

  // Update shop
  update: (id, data) =>
    api.put(`/shops/${id}`, data),
}

/*
|--------------------------------------------------------------------------
| Normalizers
|--------------------------------------------------------------------------
*/

export const normalizeShop = (
  shop
) => {
  if (!shop) return null

  return {
    id: shop.id,

    slug:
  shop.shopUrl ||
  shop.shop_url ||
  shop.slug ||
  "",

    name:
      shop.shopName ||
      "Unnamed Shop",

    description:
      shop.description ||
      "",

    image:
      shop.image ||
      null,

    logo:
      (
        shop.shopName ||
        "S"
      )[0],

    verified: true,

    rating: 5,

    productsLabel:
      `${shop?._count?.listings || 0
      } Products`,

    hue:
      "from-dcc-primary to-violet-600",
  }
}

export const normalizeListing = (listing) => {
  if (!listing) return null

  const firstVariant =
    listing.variants?.[0]

  const firstImage =
    firstVariant?.images?.[0]

  return {
    id: listing.id,

    name:
      listing.title ||
      listing.name ||
      "Product",

    slug:
      listing.slug ||
      "",

    image:
      firstImage?.url ||
      listing.image ||
      null,

    price:
      firstVariant?.price ||
      listing.price ||
      0,

    rating:
      listing.reviews?.length
        ? (
            listing.reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / listing.reviews.length
          )
        : null,

    reviewCount:
      listing.reviews?.length || 0,

    stock:
      listing.stock || 0,
  }
}