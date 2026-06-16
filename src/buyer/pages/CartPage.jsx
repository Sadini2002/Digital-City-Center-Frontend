import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import CartItemRow from '../components/cart/CartItemRow'
import CartSummary from '../components/cart/CartSummary'
import { useShop } from '../hooks/useShop'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shopping Cart', to: null },
]

export default function CartPage() {
  const { cart, cartCount, updateCartQuantity, removeFromCart, clearCart } = useShop()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
            <Link
              to="/category/electronics"
              className="mt-6 inline-block rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Start Shopping
            </Link>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Shopping Cart
          <span className="ml-2 text-lg font-medium text-slate-500">({cartCount} items)</span>
        </h1>

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
            <CartSummary subtotal={subtotal} itemCount={cartCount} onClear={clearCart} />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
