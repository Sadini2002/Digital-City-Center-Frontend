import { electronicsProducts, productsByCategorySlug } from '../../data/categoryProductsBySlug'

export const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export const locationOptions = [
  'All Locations',
  'Colombo',
  'Kandy',
  'Galle',
  'Jaffna',
]

export const ratingFilters = [
  { stars: 5, label: '5 & Up' },
  { stars: 4, label: '4 & Up' },
  { stars: 3, label: '3 & Up' },
  { stars: 2, label: '2 & Up' },
  { stars: 1, label: '1 & Up' },
]

const categoryMeta = {
  electronics: {
    title: 'Electronics & Gadgets',
    totalProducts: 642,
    subCategories: [
      { id: 'smartphones', label: 'Smartphones', count: 124 },
      { id: 'laptops', label: 'Laptops', count: 86 },
      { id: 'accessories', label: 'Accessories', count: 210 },
      { id: 'audio', label: 'Audio Gear', count: 95 },
      { id: 'wearables', label: 'Wearables', count: 67 },
      { id: 'cameras', label: 'Cameras', count: 42 },
    ],
  },
  fashion: {
    title: 'Fashion',
    totalProducts: 1200,
    subCategories: [
      { id: 'men', label: "Men's Wear", count: 320 },
      { id: 'women', label: "Women's Wear", count: 410 },
      { id: 'kids-wear', label: 'Kids Wear', count: 180 },
      { id: 'shoes', label: 'Shoes', count: 290 },
    ],
  },
  groceries: {
    title: 'Groceries',
    totalProducts: 2000,
    subCategories: [
      { id: 'rice-grains', label: 'Rice & Grains', count: 420 },
      { id: 'dairy', label: 'Dairy & Eggs', count: 310 },
      { id: 'snacks', label: 'Snacks & Biscuits', count: 580 },
      { id: 'beverages', label: 'Tea & Beverages', count: 290 },
      { id: 'spices', label: 'Spices & Cooking', count: 400 },
    ],
  },
  home: {
    title: 'Home & Living',
    totalProducts: 640,
    subCategories: [
      { id: 'bedding', label: 'Bedding', count: 120 },
      { id: 'kitchen', label: 'Kitchen', count: 180 },
      { id: 'decor', label: 'Decor', count: 95 },
      { id: 'furniture', label: 'Furniture', count: 145 },
      { id: 'cleaning', label: 'Cleaning', count: 100 },
    ],
  },
  beauty: {
    title: 'Beauty',
    totalProducts: 430,
    subCategories: [
      { id: 'skincare', label: 'Skincare', count: 140 },
      { id: 'makeup', label: 'Makeup', count: 110 },
      { id: 'haircare', label: 'Hair Care', count: 90 },
      { id: 'fragrance', label: 'Fragrance', count: 90 },
    ],
  },
  sports: {
    title: 'Sports',
    totalProducts: 310,
    subCategories: [
      { id: 'fitness', label: 'Fitness', count: 95 },
      { id: 'outdoor', label: 'Outdoor', count: 70 },
      { id: 'team-sports', label: 'Team Sports', count: 85 },
      { id: 'accessories-sport', label: 'Accessories', count: 60 },
    ],
  },
  kids: {
    title: 'Kids & Toys',
    totalProducts: 520,
    subCategories: [
      { id: 'toys', label: 'Toys', count: 220 },
      { id: 'books', label: 'Books', count: 110 },
      { id: 'baby', label: 'Baby', count: 95 },
      { id: 'school', label: 'School', count: 95 },
    ],
  },
  all: {
    title: 'All Categories',
    totalProducts: 5200,
    subCategories: [
      { id: 'electronics', label: 'Electronics', count: 642 },
      { id: 'fashion', label: 'Fashion', count: 1200 },
      { id: 'groceries', label: 'Groceries', count: 2000 },
      { id: 'home', label: 'Home & Living', count: 640 },
      { id: 'beauty', label: 'Beauty', count: 430 },
      { id: 'sports', label: 'Sports', count: 310 },
      { id: 'kids', label: 'Kids & Toys', count: 520 },
    ],
  },
}

const defaultMeta = categoryMeta.electronics

export function getCategoryMeta(slug) {
  return categoryMeta[slug] ?? {
    ...defaultMeta,
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
  }
}

export function getCategoryBreadcrumbs(slug, title) {
  return [
    { label: 'Home', to: '/' },
    { label: 'All Categories', to: '/category/all' },
    { label: title, to: null },
  ]
}

/** @deprecated use getCategoryProducts(slug) */
export const categoryProducts = electronicsProducts

export function getCategoryProducts(slug) {
  if (slug === 'all') {
    return Object.values(productsByCategorySlug).flat()
  }
  return productsByCategorySlug[slug] ?? electronicsProducts
}

export function getAllCategoryListings() {
  return Object.values(productsByCategorySlug).flat()
}

export const categoryShopsBySlug = {
  electronics: {
    featured: {
      id: 'tech-world-lk',
      name: 'Tech World LK',
      rating: 5,
      verified: true,
      description:
        "Sri Lanka's leading electronics retailer with islandwide delivery and official warranties.",
      image: '',
      logo: 'TW',
    },
    standard: [
      { id: 'gadget-master', name: 'Gadget Master', rating: 4.8, products: '180+ products', logo: 'GM', hue: 'from-sky-200 to-sky-300' },
      { id: 'mobile-hub', name: 'Mobile Hub', rating: 4.7, products: '95+ products', logo: 'MH', hue: 'from-violet-200 to-violet-300' },
    ],
  },
  fashion: {
    featured: {
      id: 'fashion-hub',
      name: 'Fashion Hub',
      rating: 4.9,
      verified: true,
      description: 'Trending styles for men, women, and kids with islandwide delivery.',
      image: '',
      logo: 'FH',
    },
    standard: [
      { id: 'style-street', name: 'Style Street', rating: 4.7, products: '220+ products', logo: 'SS', hue: 'from-pink-200 to-pink-300' },
      { id: 'urban-wear', name: 'Urban Wear', rating: 4.6, products: '150+ products', logo: 'UW', hue: 'from-rose-200 to-rose-300' },
    ],
  },
  groceries: {
    featured: {
      id: 'green-grocer',
      name: 'Green Grocer',
      rating: 4.8,
      verified: true,
      description: 'Fresh groceries and pantry staples delivered across Sri Lanka.',
      image: '',
      logo: 'GG',
    },
    standard: [
      { id: 'daily-mart', name: 'Daily Mart', rating: 4.6, products: '400+ products', logo: 'DM', hue: 'from-green-200 to-green-300' },
      { id: 'ceylon-foods', name: 'Ceylon Foods', rating: 4.7, products: '280+ products', logo: 'CF', hue: 'from-emerald-200 to-emerald-300' },
    ],
  },
  home: {
    featured: {
      id: 'home-essentials',
      name: 'Home Essentials',
      rating: 4.8,
      verified: true,
      description: 'Quality home, kitchen, and living products for every room.',
      image: '',
      logo: 'HE',
    },
    standard: [
      { id: 'cozy-living', name: 'Cozy Living', rating: 4.7, products: '120+ products', logo: 'CL', hue: 'from-amber-200 to-amber-300' },
      { id: 'kitchen-pro', name: 'Kitchen Pro', rating: 4.6, products: '90+ products', logo: 'KP', hue: 'from-orange-200 to-orange-300' },
    ],
  },
  beauty: {
    featured: {
      id: 'glow-beauty',
      name: 'Glow Beauty',
      rating: 4.9,
      verified: true,
      description: 'Skincare, makeup, and fragrance from trusted global brands.',
      image: '',
      logo: 'GB',
    },
    standard: [
      { id: 'pure-skin', name: 'Pure Skin', rating: 4.7, products: '110+ products', logo: 'PS', hue: 'from-purple-200 to-purple-300' },
      { id: 'glam-studio', name: 'Glam Studio', rating: 4.8, products: '85+ products', logo: 'GS', hue: 'from-violet-200 to-violet-300' },
    ],
  },
  sports: {
    featured: {
      id: 'active-zone',
      name: 'Active Zone',
      rating: 4.7,
      verified: true,
      description: 'Gear for fitness, outdoor adventure, and team sports.',
      image: '',
      logo: 'AZ',
    },
    standard: [
      { id: 'fit-life', name: 'Fit Life', rating: 4.6, products: '75+ products', logo: 'FL', hue: 'from-orange-200 to-orange-300' },
      { id: 'sport-max', name: 'Sport Max', rating: 4.5, products: '60+ products', logo: 'SM', hue: 'from-red-200 to-red-300' },
    ],
  },
  kids: {
    featured: {
      id: 'little-joy',
      name: 'Little Joy Toys',
      rating: 4.9,
      verified: true,
      description: 'Safe, fun toys and books for babies, kids, and teens.',
      image: '',
      logo: 'LJ',
    },
    standard: [
      { id: 'playtime', name: 'Playtime Store', rating: 4.7, products: '130+ products', logo: 'PT', hue: 'from-yellow-200 to-yellow-300' },
      { id: 'bookworms', name: 'Bookworms Kids', rating: 4.8, products: '95+ products', logo: 'BW', hue: 'from-amber-200 to-amber-300' },
    ],
  },
}

export function getCategoryShops(slug) {
  if (slug === 'all') return categoryShopsBySlug.electronics
  return categoryShopsBySlug[slug] ?? null
}

/** @deprecated use getCategoryShops(slug) */
export const categoryShops = categoryShopsBySlug.electronics

export function formatLkr(amount) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}
