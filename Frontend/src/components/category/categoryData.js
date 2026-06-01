import { IMG } from '../../config/images'

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
      { id: 'kids', label: 'Kids', count: 180 },
      { id: 'shoes', label: 'Shoes', count: 290 },
    ],
  },
  all: {
    title: 'All Categories',
    totalProducts: 5200,
    subCategories: [
      { id: 'electronics', label: 'Electronics', count: 642 },
      { id: 'fashion', label: 'Fashion', count: 1200 },
      { id: 'groceries', label: 'Groceries', count: 2000 },
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

export const categoryProducts = [
  {
    id: 'sony-wh-1000xm5',
    brand: 'SONY',
    name: 'WH-1000XM5 Wireless Headphones',
    price: 97750,
    originalPrice: 115000,
    discount: 15,
    rating: 4.8,
    reviews: 342,
    badge: { label: '-16%', type: 'sale' },
    image: IMG.products.headphones,
  },
  {
    id: 'apple-airpods-pro',
    brand: 'APPLE',
    name: 'AirPods Pro (2nd Generation)',
    price: 64990,
    originalPrice: null,
    rating: 4.9,
    reviews: 512,
    badge: { label: 'NEW', type: 'new' },
    image: IMG.products.airpods,
  },
  {
    id: 'samsung-galaxy-s24',
    brand: 'SAMSUNG',
    name: 'Galaxy S24 Ultra 256GB',
    price: 289990,
    originalPrice: 319990,
    discount: 9,
    rating: 4.7,
    reviews: 128,
    badge: { label: '-9%', type: 'sale' },
    image: IMG.products.smartphone,
  },
  {
    id: 'ultra-smart-watch-pro-10',
    brand: 'APPLE',
    name: 'Ultra-Smart Watch Pro Series 10',
    price: 45990,
    originalPrice: 57500,
    discount: 20,
    rating: 4.8,
    reviews: 128,
    badge: { label: '-20%', type: 'sale' },
    image: IMG.products.smartwatch,
  },
  {
    id: 'macbook-air-m3',
    brand: 'APPLE',
    name: 'MacBook Air 13" M3 Chip',
    price: 324990,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    badge: { label: 'NEW', type: 'new' },
    image: IMG.products.macbook,
  },
  {
    id: 'logitech-mx-master',
    brand: 'LOGITECH',
    name: 'MX Master 3S Wireless Mouse',
    price: 28500,
    originalPrice: 32000,
    discount: 11,
    rating: 4.6,
    reviews: 76,
    badge: { label: '-11%', type: 'sale' },
    image: IMG.products.mouse,
  },
  {
    id: 'jbl-flip-6',
    brand: 'JBL',
    name: 'Flip 6 Portable Bluetooth Speaker',
    price: 34990,
    originalPrice: null,
    rating: 4.5,
    reviews: 203,
    image: IMG.products.speaker,
  },
  {
    id: 'canon-eos-r50',
    brand: 'CANON',
    name: 'EOS R50 Mirrorless Camera Kit',
    price: 198990,
    originalPrice: 215000,
    discount: 7,
    rating: 4.7,
    reviews: 45,
    badge: { label: '-7%', type: 'sale' },
    image: IMG.products.camera,
  },
  {
    id: 'ipad-air',
    brand: 'APPLE',
    name: 'iPad Air 11" Wi-Fi 128GB',
    price: 174990,
    originalPrice: null,
    rating: 4.8,
    reviews: 167,
    badge: { label: 'NEW', type: 'new' },
    image: IMG.products.ipad,
  },
  {
    id: 'dell-xps-15',
    brand: 'DELL',
    name: 'XPS 15 OLED Laptop',
    price: 425000,
    originalPrice: 459000,
    discount: 7,
    rating: 4.6,
    reviews: 34,
    badge: { label: '-7%', type: 'sale' },
    image: IMG.products.laptop,
  },
  {
    id: 'anker-powerbank',
    brand: 'ANKER',
    name: '737 Power Bank 24,000mAh',
    price: 24990,
    originalPrice: null,
    rating: 4.7,
    reviews: 291,
    image: IMG.products.powerbank,
  },
  {
    id: 'lg-oled-tv',
    brand: 'LG',
    name: '55" C3 OLED 4K Smart TV',
    price: 389990,
    originalPrice: 425000,
    discount: 8,
    rating: 4.9,
    reviews: 58,
    badge: { label: '-8%', type: 'sale' },
    image: IMG.products.tv,
  },
]

export const categoryShops = {
  featured: {
    id: 'tech-world-lk',
    name: 'Tech World LK',
    rating: 5,
    verified: true,
    description: 'Sri Lanka\'s leading electronics retailer with islandwide delivery and official warranties.',
    image: IMG.shops.techWorld,
    logo: 'TW',
  },
  standard: [
    {
      id: 'gadget-master',
      name: 'Gadget Master',
      rating: 4.8,
      products: '180+ products',
      logo: 'GM',
      hue: 'from-sky-200 to-sky-300',
    },
    {
      id: 'mobile-hub',
      name: 'Mobile Hub',
      rating: 4.7,
      products: '95+ products',
      logo: 'MH',
      hue: 'from-violet-200 to-violet-300',
    },
  ],
}

export function formatLkr(amount) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}
