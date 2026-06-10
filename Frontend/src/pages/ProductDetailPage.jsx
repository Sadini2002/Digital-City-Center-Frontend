import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import ProductGallery from '../components/product/ProductGallery'
import ProductPurchasePanel from '../components/product/ProductPurchasePanel'
import ProductDetailTabs from '../components/product/ProductDetailTabs'
import ProductReviewsSection from '../buyer/components/reviews/ProductReviewsSection'
import { getProductById } from '../data/productsCatalog'

export default function ProductDetailPage() {
  const { id } = useParams()
  const reviewsRef = useRef(null)
  const product = getProductById(id)

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!product) {
    return (
      <PageContainer className="pb-12">
        <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Product not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            We could not find a listing for &quot;{id}&quot;.
          </p>
          <Link
            to="/category/electronics"
            className="mt-6 inline-block rounded-lg bg-dcc-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-dcc-primary-hover"
          >
            Browse Electronics
          </Link>
        </section>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="pb-12">
      <ProductBreadcrumbs items={product.breadcrumbs} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          badges={product.badges}
          product={{
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0],
            seller: product.seller,
          }}
        />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductDetailTabs product={product} onShowReviews={scrollToReviews} />
      <ProductReviewsSection
        ref={reviewsRef}
        productId={product.id}
        reviews={product.reviews}
        reviewCount={product.reviewCount}
      />
    </PageContainer>
  )
}
