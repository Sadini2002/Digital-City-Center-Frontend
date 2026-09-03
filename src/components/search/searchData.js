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

export function getSearchBreadcrumbs() {
	return [
		{ label: 'Home', to: '/' },
		{ label: 'Electronics', to: '/category/electronics' },
		{ label: 'Search Results', to: null },
	]
}

export { formatLkr } from '../category/categoryData'
