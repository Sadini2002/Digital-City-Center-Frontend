export const searchSortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export const searchFilterCategories = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'groceries', label: 'Groceries' },
  { id: 'home', label: 'Home & Living' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'sports', label: 'Sports' },
  { id: 'kids', label: 'Kids & Toys' },
]

export const searchLocations = [
  { id: 'colombo', label: 'Colombo' },
  { id: 'gampaha', label: 'Gampaha' },
  { id: 'kandy', label: 'Kandy' },
  { id: 'galle', label: 'Galle' },
]

export const searchDeliveryOptions = [
  { id: 'islandwide', label: 'Islandwide Delivery' },
  { id: 'free', label: 'Free Delivery' },
]

export const searchRatingFilters = [
  { stars: 0, label: 'Any rating' },
  { stars: 5, label: '5 Stars & Up' },
  { stars: 4, label: '4 Stars & Up' },
  { stars: 3, label: '3 Stars & Up' },
  { stars: 2, label: '2 Stars & Up' },
]

export const searchResults = [
  {
    id: 'bose-qc45',
    categorySlug: 'electronics',
    categoryLabel: 'AUDIO',
    brand: 'BOSE',
    name: 'QuietComfort 45 Wireless Headphones',
    price: 89990,
    originalPrice: 119990,
    rating: 4.7,
    sales: 320,
    badge: { label: '-25%', type: 'sale' },
    image: '',
  },
  {
    id: 'apple-airpods-pro',
    categorySlug: 'electronics',
    categoryLabel: 'ELECTRONICS',
    brand: 'APPLE',
    name: 'AirPods Pro (2nd Generation)',
    price: 64990,
    rating: 4.9,
    sales: 890,
    badge: { label: 'NEW', type: 'new' },
    image: '',
  },
  {
    id: 'jbl-live-660nc',
    categorySlug: 'electronics',
    categoryLabel: 'AUDIO',
    brand: 'JBL',
    name: 'Live 660NC Wireless Over-Ear Headphones',
    price: 42990,
    originalPrice: 54990,
    rating: 4.5,
    sales: 156,
    badge: { label: '-22%', type: 'sale' },
    image: '',
  },
  {
    id: 'sony-linkbuds',
    categorySlug: 'electronics',
    categoryLabel: 'ELECTRONICS',
    brand: 'SONY',
    name: 'LinkBuds S Truly Wireless Earbuds',
    price: 54990,
    rating: 4.6,
    sales: 210,
    image: '',
  },
  {
    id: 'sennheiser-hd-450',
    categorySlug: 'electronics',
    categoryLabel: 'AUDIO',
    brand: 'SENNHEISER',
    name: 'HD 450BT Wireless Headphones',
    price: 38990,
    originalPrice: 45990,
    rating: 4.4,
    sales: 98,
    badge: { label: '-15%', type: 'sale' },
    image: '',
  },
  {
    id: 'beats-studio-pro',
    categorySlug: 'electronics',
    categoryLabel: 'AUDIO',
    brand: 'BEATS',
    name: 'Studio Pro Wireless Headphones',
    price: 79990,
    rating: 4.8,
    sales: 445,
    badge: { label: 'NEW', type: 'new' },
    image: '',
  },
]

export function getSearchBreadcrumbs() {
  return [
    { label: 'Home', to: '/' },
    { label: 'Electronics', to: '/category/electronics' },
    { label: 'Search Results', to: null },
  ]
}

export { formatLkr } from '../category/categoryData'
