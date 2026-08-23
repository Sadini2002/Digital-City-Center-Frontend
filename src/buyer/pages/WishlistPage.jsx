import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'
import WishlistItemCard from '../components/wishlist/WishlistItemCard'
import { useShop } from '../hooks/useShop'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Wishlist', to: null },
]

export default function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist, wishlistCount, removeFromWishlist, moveWishlistToCart, addAllWishlistToCart } =
    useShop()

  if (wishlist.length === 0) {
    return (
      <div className="min-w-0 bg-white">
        <PageContainer className="pb-16">
          <ProductBreadcrumbs items={breadcrumbs} />
          <div className="mx-auto mt-12 max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Your wishlist is empty</h1>
            <p className="mt-2 text-sm text-slate-600">
              Tap the heart on any product to save it for later.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-dcc-primary px-6 py-3 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              Explore Products
            </Link>
          </div>
        </PageContainer>
      </div>
    )
  }

  const handleAddAllToCart = () => {
    addAllWishlistToCart()
    navigate('/cart')
  }

  return (
    <div className="min-w-0 bg-white">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Wishlist</h1>
            <p className="mt-1 text-sm text-slate-500">{wishlistCount} saved items</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 rounded-xl bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
            >
              <ShoppingCart className="h-4 w-4" />
              Add all to cart
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View cart
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
              onAddToCart={moveWishlistToCart}
            />
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
