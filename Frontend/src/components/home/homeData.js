import {
  Baby,
  Dumbbell,
  Gem,
  Laptop,
  MoreHorizontal,
  Shirt,
  ShoppingBasket,
  Sofa,
} from 'lucide-react'

export const categories = [
  { slug: 'fashion', label: 'Fashion', count: '1200+ Items', icon: Shirt, bg: 'bg-pink-100/70', iconColor: 'text-pink-600' },
  { slug: 'electronics', label: 'Electronics', count: '850+ Items', icon: Laptop, bg: 'bg-sky-100/70', iconColor: 'text-sky-600' },
  { slug: 'groceries', label: 'Groceries', count: '2000+ Items', icon: ShoppingBasket, bg: 'bg-green-100/70', iconColor: 'text-green-600' },
  { slug: 'home', label: 'Home & Living', count: '640+ Items', icon: Sofa, bg: 'bg-amber-100/70', iconColor: 'text-amber-600' },
  { slug: 'beauty', label: 'Beauty', count: '430+ Items', icon: Gem, bg: 'bg-purple-100/70', iconColor: 'text-purple-600' },
  { slug: 'sports', label: 'Sports', count: '310+ Items', icon: Dumbbell, bg: 'bg-orange-100/70', iconColor: 'text-orange-600' },
  { slug: 'kids', label: 'Kids & Toys', count: '520+ Items', icon: Baby, bg: 'bg-yellow-100/70', iconColor: 'text-yellow-700' },
  { slug: 'more', label: 'More', count: 'View all', icon: MoreHorizontal, bg: 'bg-slate-100', iconColor: 'text-slate-500', dashed: true },
]

export const flashDeals = [
  { id: 1, name: 'Wireless Headphones', price: '8,990', oldPrice: '11,990', discount: 25, hue: 'from-violet-200/90 to-violet-300/80' },
  {
    id: 'ultra-smart-watch-pro-10',
    name: 'Smart Watch Pro',
    price: '24,999',
    oldPrice: '32,999',
    discount: 24,
    hue: 'from-slate-200/90 to-slate-300/80',
  },
  { id: 3, name: 'Luxury Perfume', price: '8,750', oldPrice: '11,500', discount: 24, hue: 'from-pink-200/90 to-pink-300/80' },
  { id: 4, name: 'Running Shoes', price: '9,999', oldPrice: '14,999', discount: 33, hue: 'from-amber-200/90 to-amber-300/80' },
]

export const topShops = [
  { id: 1, name: 'Tech World LK', rating: 4.8, products: '240+ products', hue: 'from-slate-200 to-slate-300' },
  { id: 2, name: 'Fashion Hub', rating: 4.8, products: '180+ products', hue: 'from-pink-200 to-pink-300' },
  { id: 3, name: 'Green Grocer', rating: 4.7, products: '320+ products', hue: 'from-green-200 to-green-300' },
  { id: 4, name: 'Home Essentials', rating: 4.8, products: '150+ products', hue: 'from-amber-200 to-amber-300' },
]

export const heroTrust = [
  { label: 'Fast Delivery', iconBg: 'bg-violet-100', iconColor: 'text-dcc-primary' },
  { label: 'Secure Payments', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Trusted Sellers', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
]

export const valueProps = [
  { title: 'Islandwide Delivery', sub: 'Fast & reliable delivery' },
  { title: 'Secure & Safe Payments', sub: 'Multiple payment options' },
  { title: '24/7 Customer Support', sub: "We're here to help" },
  { title: 'Easy Returns', sub: 'Hassle-free returns' },
]
