import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Search,
  X,
  Printer,
  RefreshCw,
  Package,
  Truck,
  User as UserIcon,
  CreditCard,
  MapPin,
} from 'lucide-react'
import { sellerApi } from '../services/sellerApi'
import OrderTable from '../components/OrderTable'
import StatusBadge from '../components/StatusBadge'
import {
  SELLER_ORDER_ACTION_LABELS,
  SELLER_ORDER_STATUS_FILTERS,
  SELLER_ORDER_STATUS_FLOW,
  SELLER_ORDER_STATUS_LABELS,
} from '../data/sellerConstants'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })

  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const loadOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const response = await sellerApi.getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        page,
        limit: pagination.limit,
      })
      const data = response.data || {}
      setOrders(data.orders || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 })
    } catch (error) {
      console.error('Failed to load seller orders:', error)
      toast.error(error.message || 'Failed to load orders.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search, pagination.limit])

  useEffect(() => {
    loadOrders(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search])

  // Debounce search-by-order-ID input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const openDetails = async (order) => {
    setSelectedOrderId(order.orderId)
    setOrderDetails(null)
    setDetailsLoading(true)
    try {
      const response = await sellerApi.getOrderById(order.orderId)
      setOrderDetails(response.data?.order || null)
    } catch (error) {
      console.error('Failed to load order details:', error)
      toast.error(error.message || 'Failed to load order details.')
      setSelectedOrderId(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => {
    setSelectedOrderId(null)
    setOrderDetails(null)
  }

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId)
      await sellerApi.updateOrderStatus(orderId, nextStatus)
      toast.success(`Order updated to "${SELLER_ORDER_STATUS_LABELS[nextStatus] || nextStatus}".`)
      await loadOrders(pagination.page)
      if (selectedOrderId === orderId) {
        const response = await sellerApi.getOrderById(orderId)
        setOrderDetails(response.data?.order || null)
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error(error.message || 'Failed to update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePrint = async (orderSummary) => {
    let details = orderDetails && orderDetails.orderId === orderSummary.orderId ? orderDetails : null
    if (!details) {
      try {
        const response = await sellerApi.getOrderById(orderSummary.orderId)
        details = response.data?.order
      } catch (error) {
        toast.error('Could not load order for printing.')
        return
      }
    }
    printOrderSummary(details)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">
            Manage orders that contain your products. You only see and control your own items —
            even inside orders shared with other sellers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadOrders(pagination.page)}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Order ID or Order #"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {SELLER_ORDER_STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === filter.value
                  ? 'bg-dcc-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <RefreshCw className="h-6 w-6 animate-spin text-dcc-primary" />
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onViewDetails={openDetails}
          onUpdateStatus={handleUpdateStatus}
          onPrint={handlePrint}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => loadOrders(p)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                pagination.page === p
                  ? 'bg-dcc-primary text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {orderDetails ? orderDetails.orderNumber : 'Order Details'}
                </h2>
                {orderDetails && (
                  <p className="text-xs text-slate-500">
                    Placed on {new Date(orderDetails.createdAt).toLocaleString('en-LK')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {orderDetails && (
                  <button
                    type="button"
                    onClick={() => printOrderSummary(orderDetails)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Print Order Summary"
                  >
                    <Printer className="h-4.5 w-4.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeDetails}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailsLoading || !orderDetails ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-dcc-primary" />
                </div>
              ) : (
                <>
                  {/* Status + Actions */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Manage Order Status
                    </span>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={orderDetails.sellerItemStatus} />
                    </div>

                    {orderDetails.sellerItemStatus === 'mixed' ? (
                      <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                        Your items in this order are at different stages. Update them from the
                        order list once they're back in sync.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-3 mt-1 border-t border-slate-150">
                        {(SELLER_ORDER_STATUS_FLOW[orderDetails.sellerItemStatus] || []).map(
                          (nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              disabled={updatingId === orderDetails.orderId}
                              onClick={() => handleUpdateStatus(orderDetails.orderId, nextStatus)}
                              className={
                                nextStatus === 'rejected'
                                  ? 'inline-flex items-center gap-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition px-3 py-1.5 text-xs font-semibold disabled:opacity-60'
                                  : 'inline-flex items-center gap-1 rounded-lg bg-dcc-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-dcc-primary-hover transition disabled:opacity-60'
                              }
                            >
                              {SELLER_ORDER_ACTION_LABELS[nextStatus] || nextStatus}
                            </button>
                          )
                        )}
                        {(SELLER_ORDER_STATUS_FLOW[orderDetails.sellerItemStatus] || []).length === 0 && (
                          <p className="text-xs text-slate-500">
                            No further seller actions — this item has reached a final stage.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Buyer Info */}
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      <UserIcon className="h-4 w-4 text-dcc-primary" /> Buyer Information
                    </h3>
                    <div className="rounded-xl border border-slate-200 p-4 text-sm space-y-1.5">
                      <p className="font-medium text-slate-800">{orderDetails.buyer?.name}</p>
                      <p className="text-slate-500">{orderDetails.buyer?.email}</p>
                      <p className="text-slate-500">{orderDetails.buyer?.phone || 'No phone provided'}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      <Package className="h-4 w-4 text-dcc-primary" /> Your Items In This Order
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {orderDetails.items?.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {item.variant?.listing?.title || 'Product'}
                            </p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-slate-950 text-sm">
                            LKR {Number(item.subtotal || 0).toLocaleString('en-LK')}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Your Subtotal</span>
                      <span className="text-base font-bold text-slate-950">
                        LKR {Number(orderDetails.sellerSubtotal || 0).toLocaleString('en-LK')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      <Truck className="h-4 w-4 text-dcc-primary" /> Delivery Information
                    </h3>
                    <div className="rounded-xl border border-slate-200 p-4 text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-700">{orderDetails.deliveryAddress}</span>
                      </div>
                      {orderDetails.delivery ? (
                        <>
                          <div>
                            <span className="text-xs text-slate-500 block">Delivery Status</span>
                            <span className="font-medium text-slate-800">
                              {orderDetails.delivery.deliveryStatus}
                            </span>
                          </div>
                          {orderDetails.delivery.trackingNumber && (
                            <div>
                              <span className="text-xs text-slate-500 block">Tracking Number</span>
                              <span className="font-medium text-slate-800">
                                {orderDetails.delivery.trackingNumber}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-slate-500">
                          No delivery record yet — one will appear once dispatched.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      <CreditCard className="h-4 w-4 text-dcc-primary" /> Payment Method
                    </h3>
                    <div className="rounded-xl border border-slate-200 p-4 text-sm space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Method</span>
                        <span className="font-medium text-slate-800">
                          {orderDetails.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payment Status</span>
                        <span className="font-medium text-slate-800">
                          {orderDetails.paymentStatus}
                        </span>
                      </div>
                      {orderDetails.transaction?.transactionReference && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reference</span>
                          <span className="font-medium text-slate-800">
                            {orderDetails.transaction.transactionReference}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Builds and opens a printable, seller-scoped order summary
// in a new window (only this seller's items are included).
function printOrderSummary(order) {
  const win = window.open('', '_blank')
  if (!win) return

  const itemsRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td>${item.variant?.listing?.title || 'Product'}</td>
          <td>${item.quantity}</td>
          <td>LKR ${Number(item.unitPrice || 0).toLocaleString('en-LK')}</td>
          <td>LKR ${Number(item.subtotal || 0).toLocaleString('en-LK')}</td>
        </tr>`
    )
    .join('')

  win.document.write(`
    <html>
      <head>
        <title>Order Summary - ${order.orderNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 3px solid #5113D7; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .logo { font-size: 24px; font-weight: 800; color: #5113D7; }
          .title { text-align: right; }
          .title h1 { margin: 0; font-size: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 13px; }
          .card h3 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; color: #5113D7; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 12px; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          .total { text-align: right; font-size: 16px; font-weight: 800; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Digital City Center</div>
            <div style="font-size:12px;color:#64748b;">Seller Order Summary (your items only)</div>
          </div>
          <div class="title">
            <h1>${order.orderNumber}</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
              ${new Date(order.createdAt).toLocaleString('en-LK')}
            </p>
          </div>
        </div>
        <div class="grid">
          <div class="card">
            <h3>Buyer</h3>
            <p>${order.buyer?.name || ''}<br/>${order.buyer?.email || ''}<br/>${order.buyer?.phone || ''}</p>
          </div>
          <div class="card">
            <h3>Delivery Address</h3>
            <p>${order.deliveryAddress || ''}</p>
          </div>
        </div>
        <div class="grid">
          <div class="card">
            <h3>Payment</h3>
            <p>Method: ${order.paymentMethod || ''}<br/>Status: ${order.paymentStatus || ''}</p>
          </div>
          <div class="card">
            <h3>Status</h3>
            <p>${(order.sellerItemStatus || '').replace(/_/g, ' ')}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <p class="total">Your Subtotal: LKR ${Number(order.sellerSubtotal || 0).toLocaleString('en-LK')}</p>
      </body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
}
