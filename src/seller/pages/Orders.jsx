import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getOrders, updateOrderStatus } from '../../buyer'
import OrderTable from '../components/OrderTable'
import { Search, X, Package, Truck, CheckCircle2, ShoppingBag, Printer, AlertTriangle, Check, RefreshCw } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import { addBuyerNotification, addSellerNotification } from '../../utils/notificationStorage'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Initialize mock orders if empty
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

  const handleUpdateStatus = (orderId, newStatus, extraOptions = {}) => {
    let trackingStatus = newStatus
    if (newStatus === 'confirmed') trackingStatus = 'paid'
    if (newStatus === 'processing') trackingStatus = 'processing'
    if (newStatus === 'shipped' || newStatus === 'dispatched') {
      newStatus = 'shipped'
      trackingStatus = 'shipped'
    }
    if (newStatus === 'delivered' || newStatus === 'completed') {
      newStatus = 'delivered'
      trackingStatus = 'delivered'
    }

    updateOrderStatus(orderId, newStatus, { 
      trackingStatus, 
      ...extraOptions 
    })
    
    toast.success(`Order ${orderId} updated to ${newStatus}`)

    // Trigger dedicated notifications based on new status
    if (newStatus === 'cancelled') {
      addBuyerNotification('Order Cancelled', `Order ${orderId} has been cancelled by the seller.`, 'warning')
      addSellerNotification('Order Cancelled', `You have cancelled Order ${orderId}.`, 'warning')
    } else if (newStatus === 'shipped') {
      addBuyerNotification('Order Shipped', `Your order ${orderId} has been shipped and is on its way.`, 'info')
    } else if (newStatus === 'delivered') {
      addBuyerNotification('Order Delivered', `Your order ${orderId} has been delivered successfully.`, 'success')
    }
    
    // Reload state
    const updated = getOrders()
    setOrders(updated)

    // Update selected order details view if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId))
    }
  }

  const handlePrintInvoice = (order) => {
    toast.success(`Invoice generated and sent to printer for Order ${order.id}!`)
    
    // Open a simple printable invoice mockup in a new tab
    const invoiceWindow = window.open('', '_blank')
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #5113D7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #5113D7; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 30px; gap: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; padding: 12px; font-size: 14px; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #1a1523; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DIGITAL CITY CENTER</div>
            <div style="text-align: right; margin-top: -24px;"><strong>INVOICE</strong></div>
          </div>
          <div class="grid">
            <div>
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Email:</strong> ${order.email}
            </div>
            <div>
              <strong>Ship To:</strong><br>
              ${order.shippingAddress?.fullName || 'Guest Customer'}<br>
              ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}<br>
              ${order.shippingAddress?.phone || ''}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.title || item.name}</td>
                  <td>Rs. ${item.price.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total Invoice: Rs. ${order.total.toLocaleString('en-LK')}</div>
          <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #64748b;">
            Thank you for shopping with Digital City Center!
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `)
    invoiceWindow.document.close()
  }

  // Calculate order stats
  const totalCount = orders.length
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const processingCount = orders.filter(o => o.status === 'processing').length
  const deliveredCount = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === 'all') return matchesSearch
    
    // Support mapping requirement statuses (Pending, Processing, Dispatched, Completed, Cancelled)
    const statusMap = {
      pending: 'pending_payment',
      processing: 'processing',
      dispatched: 'shipped',
      completed: 'delivered',
      cancelled: 'cancelled',
    }
    
    const mappedFilter = statusMap[statusFilter] || statusFilter
    return matchesSearch && order.status === mappedFilter
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
            <option value="pending">Pending Payment</option>
            <option value="confirmed">Confirmed (New)</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched (Shipped)</option>
            <option value="completed">Completed (Delivered)</option>
            <option value="cancelled">Cancelled</option>
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                  title="Print Invoice"
                >
                  <Printer className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Order Status Section */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Manage Order Status
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-dcc-primary/10 px-3 py-1 text-xs font-bold text-dcc-primary">
                      {selectedOrder.status.toUpperCase()}
                    </span>
                    {selectedOrder.readyForPickup && (
                      <span className="inline-flex rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80 px-2.5 py-0.5 text-[10px] font-bold">
                        Ready For Pickup
                      </span>
                    )}
                  </div>
                  
                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-150">
                    {selectedOrder.status === 'confirmed' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                          className="inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
                        >
                          <Check className="h-3 w-3" /> Confirm & Process
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition px-3 py-1.5 text-xs font-semibold"
                        >
                          Reject Order
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                          className="inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition"
                        >
                          Dispatch Package
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, { readyForPickup: true })}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
                        >
                          Mark Ready for Pickup
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                      >
                        Complete Order
                      </button>
                    )}
                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition px-3 py-1.5 text-xs font-semibold"
                      >
                        Cancel Order
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

