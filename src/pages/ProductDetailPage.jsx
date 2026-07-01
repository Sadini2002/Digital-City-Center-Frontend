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
  
  // 1. New State: Track the currently selected variant object
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Fetch product from live API when component mounts or ID changes
  useEffect(() => {
    console.log("🕵️‍♂️ All Visible Vite Env Variables:", import.meta.env);
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const targetUrl = `${import.meta.env.VITE_API_BASE_URL}/products/${id}`;
        console.log("🎯 Axios is sending a request to:", targetUrl);

        const response = await axios.get(targetUrl)
        
        if (response.data && response.data.success) {
          const fetchedProduct = response.data.data
          setProduct(fetchedProduct)
          
          // 2. Automatically select the first available variant on load
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            setSelectedVariant(fetchedProduct.variants[0])
          }
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

  const breadcrumbs = product.breadcrumbs || [
    { label: 'Home', url: '/' },
    { label: product.category?.name || 'Category', url: `/category/${product.category?.id || ''}` },
    { label: product.title, url: '#' }
  ]

  // 3. Dynamic Image Extraction: Base images on the SELECTED variant instead of flatMapping everything
  const currentVariantImages = selectedVariant?.images?.map(img => img.url) || []
  
  const productImages = currentVariantImages.length > 0
    ? currentVariantImages
    : [product.img || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500']

  // 4. Dynamic Pricing based on selection
  const currentPrice = selectedVariant ? selectedVariant.price : 0;

  // 5. Variant Matching Function triggered when attributes are chosen in the purchase panel
  const handleVariantChange = (selectedAttributes) => {
    // Look through database variants to see if there is a matching configuration profile
    const match = product.variants.find(variant => 
      Object.entries(selectedAttributes).every(([key, value]) => variant.attributes[key] === value)
    )

    if (match) {
      setSelectedVariant(match)
      setActiveImageIndex(0) // Reset the gallery back to the main image of the new color profile
    }
  }

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
            price: currentPrice,
            originalPrice: product.originalPrice || currentPrice,
            image: productImages[0],
            seller: product.seller || { shopName: 'Verified Seller' },
          }}
        />
        
        <ProductPurchasePanel
          product={{
            ...product,
            images: productImages,
            brand: product.brand || 'Generic',
            price: currentPrice,
            selectedVariant: selectedVariant, // Pass state context into selection rows
          }}
          // 6. Connect selection adjustments straight into state matching handler
          onVariantSelect={handleVariantChange} 
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