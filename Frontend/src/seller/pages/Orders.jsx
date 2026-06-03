import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getOrders, updateOrderStatus } from '../../buyer'
import OrderTable from '../components/OrderTable'
import { Search, X, Package, Truck, CheckCircle2, ShoppingBag } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Initialize mock orders if empty to make the platform interactive immediately
  const loadAndInitializeOrders = () => {
    const existing = getOrders()
    if (existing.length > 0) {
      setOrders(existing)
    } else {
      const initial = [
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
      localStorage.setItem('dcc_orders', JSON.stringify(initial))
      setOrders(initial)
    }
  }

  useEffect(() => {
    loadAndInitializeOrders()
  }, [])

  const handleUpdateStatus = (orderId, newStatus) => {
    // Determine appropriate trackingStatus
    let trackingStatus = newStatus
    if (newStatus === 'confirmed') trackingStatus = 'paid'
    if (newStatus === 'processing') trackingStatus = 'processing'
    if (newStatus === 'shipped') trackingStatus = 'shipped'
    if (newStatus === 'delivered') trackingStatus = 'delivered'

    updateOrderStatus(orderId, newStatus, { trackingStatus })
    toast.success(`Order ${orderId} updated to ${newStatus}`)
    
    // Reload state
    const updated = getOrders()
    setOrders(updated)

    // Update selected order view if it is currently open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId))
    }
  }

  // Calculate order stats
  const totalCount = orders.length
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const processingCount = orders.filter(o => o.status === 'processing').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === 'all') return matchesSearch
    return matchesSearch && order.status === statusFilter
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Orders" value={totalCount} hint="Lifetime orders" icon={ShoppingBag} />
        <DashboardCard title="New Orders" value={confirmedCount} hint="Requires prep" icon={Package} />
        <DashboardCard title="Processing" value={processingCount} hint="In packaging" icon={Truck} />
        <DashboardCard title="Completed" value={deliveredCount} hint="Delivered orders" icon={CheckCircle2} />
      </section>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by ID, email, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/10 transition"
          >
            <option value="all">All Orders</option>
            <option value="confirmed">Confirmed (New)</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="pending_payment">Awaiting Payment</option>
          </select>
        </div>
      </div>

      <OrderTable
        orders={filteredOrders}
        onViewDetails={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Slide-over details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slideLeft">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Order {selectedOrder.id}</h2>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Order Status Section */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Order Status
                </span>
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-dcc-primary/10 px-3 py-1 text-xs font-bold text-dcc-primary">
                    {selectedOrder.status.toUpperCase()}
                  </span>
                  
                  {/* Status update action dropdown/buttons inside details */}
                  <div className="flex gap-2">
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                        className="rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
                      >
                        Accept & Process
                      </button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                        className="rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
                      >
                        Ship Package
                      </button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Ordered List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Items Ordered
                </h3>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.title || item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-slate-950 text-sm">
                        LKR {Number(item.price * item.quantity).toLocaleString('en-LK')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Invoice</span>
                  <span className="text-base font-bold text-slate-950">
                    LKR {Number(selectedOrder.total || 0).toLocaleString('en-LK')}
                  </span>
                </div>
              </div>

              {/* Shipping Address Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Shipping Information
                </h3>
                <div className="rounded-xl border border-slate-200 p-4 text-sm space-y-2.5">
                  <div>
                    <span className="text-xs text-slate-500 block">Recipient Name</span>
                    <span className="font-medium text-slate-800">
                      {selectedOrder.shippingAddress?.fullName || 'Guest Customer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Contact Phone</span>
                    <span className="font-medium text-slate-800">
                      {selectedOrder.shippingAddress?.phone || 'No phone provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Street Address</span>
                    <span className="font-medium text-slate-800">
                      {selectedOrder.shippingAddress?.street || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">City</span>
                    <span className="font-medium text-slate-800">
                      {selectedOrder.shippingAddress?.city || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
