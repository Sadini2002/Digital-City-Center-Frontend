import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import ProductGallery from '../components/product/ProductGallery'
import ProductPurchasePanel from '../components/product/ProductPurchasePanel'
import ProductDetailTabs from '../components/product/ProductDetailTabs'
import ProductReviewsSection from '../buyer/components/reviews/ProductReviewsSection'

import { mapListingToProductDetail } from '../buyer/services/productMapper'
import { productsApi } from '../services/api'
import { getProductById as getLocalProductById } from '../data/productsCatalog'

export default function ProductDetailPage() {
  const { id } = useParams()

  const reviewsRef = useRef(null)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')
      setProduct(null)
      setActiveImageIndex(0)

      try {
        const isNumericId = /^\d+$/.test(String(id))

        // ======================================================
        // 1. REAL DATABASE PRODUCT
        // ======================================================
        if (isNumericId) {
          const response = await productsApi.getById(id)

          const listing =
            response?.data?.data ??
            response?.data

          const mapped =
            mapListingToProductDetail(listing)

          if (!mapped) {
            throw new Error('Product not found.')
          }

          if (!cancelled) {
            setProduct(mapped)
          }

          return
        }

        // ======================================================
        // 2. STATIC / LEGACY FRONTEND PRODUCT
        // ======================================================
        const localProduct =
          getLocalProductById(id)

        if (localProduct) {
          if (!cancelled) {
            setProduct(localProduct)
          }

          return
        }

        throw new Error('Product not found.')
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load product details.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (id) {
      loadProduct()
    } else {
      setLoading(false)
      setError('Invalid product ID.')
    }

    return () => {
      cancelled = true
    }
  }, [id])

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (loading) {
    return (
      <PageContainer className="pb-12">
        <div className="flex flex-col items-center max-w-md mx-auto mt-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-dcc-primary" />

          <p className="mt-4 text-sm text-slate-600">
            Loading product…
          </p>
        </div>
      </PageContainer>
    )
  }

  if (error || !product) {
    return (
      <PageContainer className="pb-12">
        <section className="max-w-md p-8 mx-auto text-center bg-white border shadow-sm rounded-2xl border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error ||
              `We could not find a product for "${id}".`}
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
      <ProductBreadcrumbs
        items={product.breadcrumbs}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images || []}
          badges={product.badges || []}
          activeIndex={activeImageIndex}
          onChangeActiveIndex={
            setActiveImageIndex
          }
          product={{
            id: product.id,
            listingId:
              product.listingId ??
              product.id,
            variantId:
              product.variantId ??
              product.selectedVariantId,
            title: product.title,
            brand: product.brand,
            price: product.price,
            originalPrice:
              product.originalPrice,
            image:
              product.images?.[0],
            seller: product.seller,
            stock: product.stock,
            variants:
              product.variants || [],
          }}
        />

        <ProductPurchasePanel
          product={product}
          onSelectColor={(colorIndex) => {
            if (
              product.images &&
              product.images[colorIndex]
            ) {
              setActiveImageIndex(
                colorIndex,
              )
            }
          }}
        />
      </div>

      <ProductDetailTabs
        product={product}
        onShowReviews={scrollToReviews}
      />

      <ProductReviewsSection
        ref={reviewsRef}
        productId={product.id}
        reviews={product.reviews || []}
        reviewCount={
          product.reviewCount || 0
        }
      />
    </PageContainer>
  )
}