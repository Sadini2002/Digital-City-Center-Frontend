import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, ShoppingBag, Star, Wallet } from 'lucide-react'
import { getOrders } from '../../buyer'
import DashboardCard from '../components/DashboardCard'
import StatusBadge from '../components/StatusBadge'
import { addSellerNotification, getSellerNotifications } from '../../utils/notificationStorage'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function SellerDashboard() {
  const user = readUser()
  const name = user.name || 'Seller'

  const [orders, setOrders] = useState([])
  const [productsCount, setProductsCount] = useState(0)
  const [activeProductsCount, setActiveProductsCount] = useState(0)
  const [lowStockProducts, setLowStockProducts] = useState([])

  useEffect(() => {
    // Read and initialize orders if empty
    let realOrders = getOrders()
    if (realOrders.length === 0) {
      realOrders = [
        {
          id: 'DCC-58291',
          email: 'customer.sachini@gmail.com',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          total: 85000,
          status: 'confirmed',
          items: [
            { id: 'sony-wh-1000xm5', title: 'Sony WH-1000XM5 Headphones', price: 85000, quantity: 1 }
          ],
          shippingAddress: {
            fullName: 'Sachini Wijesundara',
            phone: '+94 77 123 4567',
            street: '123, Galle Road',
            city: 'Colombo 03',
          }
        },
        {
          id: 'DCC-41920',
          email: 'john.doe@yahoo.com',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          total: 130000,
          status: 'processing',
          items: [
            { id: 'apple-airpods-pro', title: 'Apple AirPods Pro (2nd Gen)', price: 65000, quantity: 2 }
          ],
          shippingAddress: {
            fullName: 'John Doe',
            phone: '+94 71 987 6543',
            street: '45, Kandy Road',
            city: 'Kandy',
          }
        },
        {
          id: 'DCC-29104',
          email: 'nimal.fernando@outlook.com',
          createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          total: 350000,
          status: 'delivered',
          items: [
            { id: 'macbook-air-m3', title: 'MacBook Air 13" M3 Laptop', price: 350000, quantity: 1 }
          ],
          shippingAddress: {
            fullName: 'Nimal Fernando',
            phone: '+94 72 444 5555',
            street: '88/B, Negombo Road',
            city: 'Negombo',
          }
        }
      ]
      localStorage.setItem('dcc_orders', JSON.stringify(realOrders))
    }
    setOrders(realOrders)

    // Read and initialize listings count
    const localProducts = JSON.parse(localStorage.getItem('dcc_seller_products') || '[]')
    if (localProducts.length > 0) {
      setProductsCount(localProducts.length)
      setActiveProductsCount(localProducts.filter(p => p.isAvailable && p.stock > 0).length)
      const low = localProducts.filter(p => p.itemType === 'physical' && p.stock <= 5)
      setLowStockProducts(low)
      
      // Trigger critical low stock alerts (1 unit remaining)
      localProducts.forEach(p => {
        if (p.stock !== undefined && p.stock <= 1 && p.stock > 0) {
          const name = p.name || p.title
          const notifs = getSellerNotifications()
          const exists = notifs.some(n => n.title === 'Low Stock Alert' && n.message.includes(name))
          if (!exists) {
            addSellerNotification(
              'Low Stock Alert',
              `Product "${name}" has reached a critical stock level of ${p.stock} unit(s).`,
              'warning'
            )
          }
        }
      })
    } else {
      setProductsCount(4)
      setActiveProductsCount(3)
      const defaultLow = [
        { id: 'canon-eos-r50', name: 'Canon EOS R50 Mirrorless Camera', stock: 1 }
      ]
      setLowStockProducts(defaultLow)
      
      // Trigger alert for default low stock product
      defaultLow.forEach(p => {
        const notifs = getSellerNotifications()
        const exists = notifs.some(n => n.title === 'Low Stock Alert' && n.message.includes(p.name))
        if (!exists) {
          addSellerNotification(
            'Low Stock Alert',
            `Product "${p.name}" has reached a critical stock level of ${p.stock} unit(s).`,
            'warning'
          )
        }
      })
    }
  }, [])

  // Calculations for cards
  const pendingOrdersCount = orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length

  const paidOrders = orders.filter(o => 
    o.status === 'confirmed' || 
    o.status === 'processing' || 
    o.status === 'shipped' || 
    o.status === 'delivered'
  )
  const grossSales = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const platformFee = grossSales * 0.10
  const netEarnings = grossSales - platformFee

  // Get top 5 recent orders
  const recentOrdersList = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-6">
        <p className="text-sm font-medium text-dcc-primary">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Hi, {name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Quick snapshot of your shop. Use the menu to manage listings and orders.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white hover:bg-dcc-primary-hover transition"
          >
            Add listing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            View orders
          </Link>
        </div>
      </section>

      {lowStockProducts.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm">Low Stock Alert!</h3>
              <p className="text-xs text-amber-700 mt-1">
                The following products are running out of stock. Please restock soon:
              </p>
              <ul className="mt-2 space-y-1 list-disc pl-5 text-xs text-amber-800 font-semibold">
                {lowStockProducts.map(p => (
                  <li key={p.productId || p._id || p.id}>
                    {p.name} (Only {p.stock} remaining)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard 
          title="Products" 
          value={productsCount} 
          hint={`${activeProductsCount} active listings`} 
          icon={ShoppingBag} 
          to="/seller/listings"
        />
        <DashboardCard 
          title="Orders" 
          value={orders.length} 
          hint={`${pendingOrdersCount} awaiting action`} 
          icon={Package} 
          to="/seller/orders"
        />
        <DashboardCard 
          title="Earnings" 
          value={`Rs. ${Number(netEarnings).toLocaleString('en-LK')}`} 
          hint="Net earnings" 
          icon={Wallet} 
          to="/seller/earnings"
        />
        <DashboardCard 
          title="Rating" 
          value="4.8" 
          hint="128 reviews" 
          icon={Star} 
          to="/seller/settings"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900">Recent orders</h2>
            <p className="text-sm text-slate-500">Latest activity from your shop</p>
          </div>
          <Link
            to="/seller/orders"
            className="text-sm font-semibold text-dcc-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrdersList.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                  <td className="px-4 py-3 text-slate-700">{order.shippingAddress?.fullName || 'Guest Customer'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
