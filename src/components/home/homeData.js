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
import { IMG } from '../../config/images'

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
  {
    id: 'sony-wh-1000xm5',
    name: 'WH-1000XM5 Headphones',
    price: '97,750',
    oldPrice: '115,000',
    discount: 16,
    hue: 'from-violet-200/90 to-violet-300/80',
    image: IMG.products.headphones,
  },
  {
    id: 'ultra-smart-watch-pro-10',
    name: 'Smart Watch Pro',
    price: '45,990',
    oldPrice: '57,500',
    discount: 20,
    hue: 'from-slate-200/90 to-slate-300/80',
    image: IMG.products.smartwatch,
  },
  {
    id: 'apple-airpods-pro',
    name: 'AirPods Pro (2nd Gen)',
    price: '64,990',
    oldPrice: null,
    discount: null,
    hue: 'from-pink-200/90 to-pink-300/80',
    image: IMG.products.airpods,
  },
  {
    id: 'logitech-mx-master',
    name: 'MX Master 3S Mouse',
    price: '28,500',
    oldPrice: '32,000',
    discount: 11,
    hue: 'from-amber-200/90 to-amber-300/80',
    image: IMG.products.mouse,
  },
]

export const topShops = [
  { id: 1, name: 'Tech World LK', rating: 4.8, products: '240+ products', hue: 'from-slate-200 to-slate-300', image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Fashion Hub', rating: 4.8, products: '180+ products', hue: 'from-pink-200 to-pink-300', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Green Grocer', rating: 4.7, products: '320+ products', hue: 'from-green-200 to-green-300', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Home Essentials', rating: 4.8, products: '150+ products', hue: 'from-amber-200 to-amber-300', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60' },
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
