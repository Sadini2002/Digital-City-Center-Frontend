import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import ProductBreadcrumbs from "../components/product/ProductBreadcrumbs";
import ProductGallery from "../components/product/ProductGallery";
import ProductPurchasePanel from "../components/product/ProductPurchasePanel";
import ProductDetailTabs from "../components/product/ProductDetailTabs";
import ProductReviewsSection from "../buyer/components/reviews/ProductReviewsSection";
import api from "../services/api/axios";

export default function ProductDetailPage() {
  const { id } = useParams();
  const reviewsRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProduct = async () => {
  try {
    const res = await api.get(`/products/${id}`);

    console.log("Response:", res.data);

    const p = res.data.data;
    console.log("PRODUCT:", p);
    console.log("VARIANTS:", p.variants);

    setProduct({
  id: p.id,

  title: p.title || p.name || "Unnamed Product",

  price: Number(p.variants?.[0]?.price) || 0,

  originalPrice: Number(p.originalPrice) || null,

  stock: Number(p.variants?.[0]?.stock) || 0,

  rating:
  p.reviews?.length
    ? p.reviews.reduce((s, r) => s + r.rating, 0) /
      p.reviews.length
    : 0,

  reviewCount:
  p.reviews?.length || 0,

  seller: {
    name: p.seller?.shopName || "Unknown Seller",
    shopSlug: p.seller?.shopUrl || "",
    verified: true,
    feedback: "Trusted Seller",
  },

  images:
  p.variants?.flatMap(
    variant =>
      variant.images?.map(img => img.url) || []
  ) || [],

  reviews: [],
  colors: [],
  sizes: [],
  badges: [],
  breadcrumbs: [],
  description:
  p.description ||
  "No product description available.",

featureCards: [
  {
    title: "Premium Quality",
    description: "Carefully selected high-quality materials.",
    icon: "battery",
  },
  {
    title: "Trusted Seller",
    description: p.seller?.shopName || "Verified Seller",
    icon: "heart",
  },
],

highlights: [
  `Category: ${p.category?.name || "N/A"}`,
  `Seller: ${p.seller?.shopName || "Unknown Seller"}`,
  `Stock: ${p.variants?.[0]?.stock ?? 0} available`,
  `Status: ${p.status || "Available"}`,
],

specifications: [
  {
    label: "Category",
    value: p.category?.name || "N/A",
  },
  {
    label: "Seller",
    value: p.seller?.shopName || "N/A",
  },
  {
    label: "Price",
    value: `LKR ${Number(p.variants?.[0]?.price || 0).toLocaleString()}`,
  },
  {
    label: "Stock",
    value: `${p.variants?.[0]?.stock ?? 0}`,
  },
  {
    label: "SKU",
    value: p.variants?.[0]?.sku || "N/A",
  },
  {
    label: "Status",
    value: p.status || "Active",
  },

  ...(p.variants?.[0]?.attributes
    ? Object.entries(p.variants[0].attributes).map(([key, value]) => ({
        label: key,
        value: String(value),
      }))
    : []),
],

relatedProducts: [],
});
  } catch (error) {
    console.error("Product fetch error:", error);
    setProduct(null);
  } finally {
    setLoading(false);
  }
};


  fetchProduct();

}, [id]);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          Loading...
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer className="pb-12">
        <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Could not find product {id}
          </p>

          <Link
            to="/shops"
            className="mt-6 inline-block rounded-lg bg-dcc-primary px-5 py-2.5 text-white"
          >
            Browse Shops
          </Link>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-12">
      <ProductBreadcrumbs
        items={product.breadcrumbs || []}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images || []}
          badges={product.badges || []}
          activeIndex={activeImageIndex}
          onChangeActiveIndex={setActiveImageIndex}
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

        <ProductPurchasePanel
          product={product}
          onSelectColor={(colorIndex) => {
            if (product.images?.[colorIndex]) {
              setActiveImageIndex(colorIndex);
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
        reviewCount={product.reviewCount || 0}
      />
    </PageContainer>
  );
}