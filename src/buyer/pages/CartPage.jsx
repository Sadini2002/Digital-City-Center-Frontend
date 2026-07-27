import { Link } from 'react-router-dom'
import { Loader2, ShoppingBag } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import CartItemRow from '../components/cart/CartItemRow'
import CartSummary from '../components/cart/CartSummary'
import { useShop } from '../hooks/useShop'
import { getAuthToken } from '../../utils/authStorage'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shopping Cart', to: null },
]

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSummary,
    cartLoading,
    cartReady,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  } = useShop()

  const subtotal = cartSummary?.subtotal ?? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = cartSummary?.deliveryFee ?? 0
  const total = cartSummary?.total ?? subtotal + deliveryFee
  const loggedIn = Boolean(getAuthToken())

  if (!cartReady || cartLoading) {
    return (
      <div className="min-w-0 bg-white">
        <PageContainer className="pb-16">
          <ProductBreadcrumbs items={breadcrumbs} />
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-dcc-primary" />
            <p className="mt-4 text-sm text-slate-600">Loading your cart…</p>
          </div>
        </PageContainer>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-w-0 bg-white">
        <PageContainer className="pb-16">
          <ProductBreadcrumbs items={breadcrumbs} />
          <div className="mx-auto mt-12 max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <ShoppingBag className="h-8 w-8 text-dcc-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Your cart is empty</h1>
            <p className="mt-2 text-sm text-slate-600">
              Browse categories and add items you love — they will show up here.
            </p>
            {!loggedIn && (
              <p className="mt-3 text-xs text-slate-500">
                Sign in to sync your cart across devices.
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/category/electronics"
                className="inline-block rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
              >
                Start Shopping
              </Link>
              {!loggedIn && (
                <Link
                  to="/login"
                  state={{ from: '/cart' }}
                  className="inline-block rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Shopping Cart
            <span className="ml-2 text-lg font-medium text-slate-500">({cartCount} items)</span>
          </h1>
          {loggedIn && (
            <button
              type="button"
              onClick={() => refreshCart().catch(() => {})}
              className="text-sm font-medium text-slate-500 hover:text-dcc-primary"
            >
              Refresh prices
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 sm:px-6">
            {cart.map((item) => (
              <CartItemRow
                key={item.lineId || item.id}
                item={item}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              itemCount={cartCount}
              currency={cartSummary?.currency || 'LKR'}
              freeDeliveryThreshold={cartSummary?.freeDeliveryThreshold}
              onClear={clearCart}
              useServerTotals={loggedIn}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
