import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import ProductGallery from '../components/product/ProductGallery'
import ProductPurchasePanel from '../components/product/ProductPurchasePanel'
import ProductDetailTabs from '../components/product/ProductDetailTabs'
import ProductReviewsSection from '../components/product/ProductReviewsSection'
import { defaultProduct } from '../components/product/productDetailData'

export default function ProductDetailPage() {
  const { id } = useParams()
  const reviewsRef = useRef(null)
  const product = { ...defaultProduct, id: id ?? defaultProduct.id }

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <PageContainer className="pb-12">
      <ProductBreadcrumbs items={product.breadcrumbs} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} badges={product.badges} />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductDetailTabs product={product} onShowReviews={scrollToReviews} />
      <ProductReviewsSection ref={reviewsRef} reviews={product.reviews} />
    </PageContainer>
  )
}
