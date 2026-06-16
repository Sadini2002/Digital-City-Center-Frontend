import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getAuthToken } from '../../utils/authStorage'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import ProductTable from '../components/ProductTable'

export default function Product() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const token = getAuthToken()
  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:5000/api'
  ).replace(/\/+$/, '')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${apiBase}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      setProducts(res.data || [])
    } catch (err) {
      console.warn('API error fetching products, falling back to local storage', err)
      // Fallback
      const local = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
      if (local.length > 0) {
        setProducts(local)
      } else {
        const savedSettings = JSON.parse(localStorage.getItem('dcc_shop_settings') || '{}');
        const currentShopName = savedSettings.shopName || 'Tech World LK';
        const currentShopSlug = currentShopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Prepopulate some default listings matching catalog
        const initial = [
          {
            _id: 'sony-wh-1000xm5',
            productId: 'sony-wh-1000xm5',
            name: 'Sony WH-1000XM5 Headphones',
            price: 85000,
            labelPrice: 95000,
            stock: 24,
            isAvailable: true,
            image: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'],
            description: 'Industry-leading noise canceling with Auto NC Optimizer, crystal-clear hands-free calling, and up to 30 hours of battery life.',
            shopId: currentShopSlug,
          },
          {
            _id: 'apple-airpods-pro',
            productId: 'apple-airpods-pro',
            name: 'Apple AirPods Pro (2nd Gen)',
            price: 65000,
            labelPrice: 70000,
            stock: 40,
            isAvailable: true,
            image: ['https://images.unsplash.com/photo-1588449668338-d151688ab3a8?w=500&auto=format&fit=crop&q=60'],
            description: 'AirPods Pro (2nd generation) with Active Noise Cancellation, Adaptive Transparency, and personalized Spatial Audio.',
            shopId: currentShopSlug,
          },
          {
            _id: 'macbook-air-m3',
            productId: 'macbook-air-m3',
            name: 'MacBook Air 13" M3 Laptop',
            price: 350000,
            labelPrice: 380000,
            stock: 8,
            isAvailable: true,
            image: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60'],
            description: 'MacBook Air 13" with the Apple M3 chip, stunning Liquid Retina display, and all-day battery life.',
            shopId: currentShopSlug,
          },
          {
            _id: 'logitech-mx-master',
            productId: 'logitech-mx-master',
            name: 'Logitech MX Master 3S Mouse',
            price: 28000,
            labelPrice: 32000,
            stock: 0,
            isAvailable: false,
            image: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60'],
            description: 'MX Master 3S is a precision wireless mouse with quiet clicks, an 8K DPI sensor, and ergonomic sculpting.',
            shopId: currentShopSlug,
          }
        ]
        setProducts(initial)
        localStorage.setItem('dcc_seller_products', JSON.stringify(initial))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return

    try {
      await axios.delete(`${apiBase}/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      console.warn('API error deleting product, falling back to local storage', err)
      const local = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
      const updated = local.filter((p) => (p._id || p.id) !== id)
      localStorage.setItem('dcc_seller_products', JSON.stringify(updated))
      toast.success('Product deleted successfully (local)')
      fetchProducts()
    }
  }

  // Filter listings based on search query and status filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product._id?.toLowerCase().includes(searchQuery.toLowerCase())

    const isAvailable = product.isAvailable && product.stock > 0
    if (statusFilter === 'available') {
      return matchesSearch && isAvailable
    } else if (statusFilter === 'outofstock') {
      return matchesSearch && !isAvailable
    }
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by name or product ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          >
            <option value="all">All Listings</option>
            <option value="available">Available</option>
            <option value="outofstock">Out of Stock</option>
          </select>

          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Listing
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-dcc-primary" />
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={handleDelete} />
      )}
    </div>
  )
}
