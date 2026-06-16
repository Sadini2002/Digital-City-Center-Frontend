import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import PageContainer from '../components/layout/PageContainer'
import ProductBreadcrumbs from '../components/product/ProductBreadcrumbs'
import ProductGallery from '../components/product/ProductGallery'
import ProductPurchasePanel from '../components/product/ProductPurchasePanel'
import ProductDetailTabs from '../components/product/ProductDetailTabs'
import ProductReviewsSection from '../buyer/components/reviews/ProductReviewsSection'


export default function ProductDetailPage() {
  const { id } = useParams()
  const reviewsRef = useRef(null)

  // State management for live API data
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Fetch product from live API when component mounts or ID changes
  useEffect(() => {
    console.log("🕵️‍♂️ All Visible Vite Env Variables:", import.meta.env);
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 1. Construct the target URL cleanly using the exact env key
        const targetUrl = `${import.meta.env.VITE_API_BASE_URL}/products/${id}`;
        
        // 2. Log it out to see exactly what it looks like!
        console.log("🎯 Axios is sending a request to:", targetUrl);

        const response = await axios.get(targetUrl)
        
        if (response.data && response.data.success) {
          setProduct(response.data.data)
        }
      } catch (err) {
        console.error("Axios Fetch Error:", err)
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])
   


  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 1. LOADING STATE
  if (loading) {
    return (
      <PageContainer className="pb-12 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-dcc-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Loading product details...</p>
        </div>
      </PageContainer>
    )
  }

  // 2. ERROR / NOT FOUND STATE
  if (error || !product) {
    return (
      <PageContainer className="pb-12">
        <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Product not found</h1>
          <p className="mt-2 text-sm text-slate-600">
            {error || `We could not find a listing for ID "${id}".`}
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

  // Extract breadcrumbs from real category data or fallback to defaults
  // Aligned with database model fields: 'title' and 'category' relation
  const breadcrumbs = product.breadcrumbs || [
    { label: 'Home', url: '/' },
    { label: product.category?.name || 'Category', url: `/category/${product.category?.id || ''}` },
    { label: product.title, url: '#' }
  ]

  // Structure image array format for <ProductGallery /> component
  // Maps your database table string to the structure expected by the gallery component
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'] // fallback placeholder image



  return (
    <PageContainer className="pb-12">
      <ProductBreadcrumbs items={breadcrumbs} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={productImages}
          badges={product.badges || []}
          activeIndex={activeImageIndex}
          onChangeActiveIndex={setActiveImageIndex}
          product={{
            id: product.id,
            title: product.title,
            brand: product.brand || 'Generic',
            price: product.price,
            originalPrice: product.originalPrice || product.price, // Fallback to current price since schema doesn't have markdown fields
            image: productImages[0],
            seller: product.seller || { shopName: 'Verified Seller' },
          }}
        />
        <ProductPurchasePanel
          product={{
            ...product,
            images: productImages,
            brand: product.brand || 'Generic',
          }}
          onSelectColor={(colorIndex) => {
            if (productImages[colorIndex]) {
              setActiveImageIndex(colorIndex)
            }
          }}
        />
      </div>

      <ProductDetailTabs product={product} onShowReviews={scrollToReviews} />
      <ProductReviewsSection
        ref={reviewsRef}
        productId={product.id}
        reviews={product.reviews || []}
        reviewCount={product.reviews?.length || 0}
      />
    </PageContainer>
  )
}