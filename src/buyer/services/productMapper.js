const COLOR_SWATCHES = {
  black: '#1f2937',
  graphite: '#374151',
  silver: '#d1d5db',
  white: '#f8fafc',
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  gold: '#d4a017',
  pink: '#ec4899',
  purple: '#7c3aed',
  brown: '#92400e',
  beige: '#d6d3d1',
  grey: '#9ca3af',
  gray: '#9ca3af',
}

function attrMap(attributes = {}) {
  return Object.entries(attributes).reduce((acc, [key, value]) => {
    acc[String(key).toLowerCase()] = String(value)
    return acc
  }, {})
}

function pickAttr(attributes, keys) {
  const map = attrMap(attributes)
  for (const key of keys) {
    if (map[key]) return map[key]
  }
  return ''
}

function swatchFor(colorName = '') {
  const key = colorName.toLowerCase().trim()
  return COLOR_SWATCHES[key] || '#94a3b8'
}

function pickImages(listing) {
  const urls = []
  for (const variant of listing.variants || []) {
    for (const image of variant.images || []) {
      if (image?.url && !urls.includes(image.url)) urls.push(image.url)
    }
  }
  return urls.length ? urls : ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500']
}

function brandFromDescription(description = '') {
  const parts = description.split(' - ')
  return parts.length > 1 ? parts[0].trim() : ''
}

const FALLBACK_CARD_IMAGE =
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60'

/**
 * Map a backend listing (category-normalized or raw shop listing) into the
 * card / add-to-cart shape. Always exposes numeric listingId + variantId.
 */
export function mapListingToCardProduct(listing, categorySlug = '') {
  if (!listing) return null

  const variants = listing.variants || []
  const activeVariants = variants.filter((v) => v.status !== 'inactive')
  const usableVariants = activeVariants.length ? activeVariants : variants
  const primary =
    usableVariants.find((v) => (Number(v.stock) || 0) > 0) || usableVariants[0] || null

  const reviews = listing.reviews || []
  const reviewRatings = reviews.map((r) => Number(r.rating) || 0).filter((n) => n > 0)
  const averageRating =
    listing.rating != null
      ? Number(listing.rating)
      : reviewRatings.length
        ? reviewRatings.reduce((sum, n) => sum + n, 0) / reviewRatings.length
        : 4.5

  let image = listing.image || null
  if (!image && primary?.images?.length) {
    const mainImage = primary.images.find((item) => item.isMain)
    image = mainImage?.url || primary.images[0]?.url || null
  }

  const description = listing.description || ''
  const brand = brandFromDescription(description)
  const slug =
    listing.category?.slug ||
    categorySlug ||
    (listing.category?.name || 'marketplace').toString().toLowerCase().replace(/\s+/g, '-')

  const listingId = Number(listing.id)
  const variantId = primary?.id != null ? Number(primary.id) : undefined

  return {
    id: listingId,
    listingId,
    productId: listingId,
    variantId,
    selectedVariantId: variantId,
    variants: usableVariants,
    name: listing.title || listing.name || 'Product',
    brand,
    description:
      description.includes(' - ') && brand
        ? description.split(' - ').slice(1).join(' - ')
        : description,
    price: Number(listing.price ?? primary?.price ?? 0),
    originalPrice: listing.originalPrice ?? null,
    rating: Number(averageRating.toFixed?.(1) ?? averageRating),
    reviews: Number(listing.reviewCount ?? reviewRatings.length ?? 0),
    sales: Number(listing.sold || 0),
    image: image || FALLBACK_CARD_IMAGE,
    badge: listing.badge || null,
    categorySlug: slug,
    categoryLabel: listing.category?.name || slug,
    shopId: listing.seller?.shopUrl || listing.seller?.id || null,
    status: listing.status,
  }
}

/**
 * Map backend listing payload into the shape expected by ProductPurchasePanel.
 */
export function mapListingToProductDetail(listing) {
  if (!listing) return null

  const activeVariants = (listing.variants || []).filter((v) => v.status !== 'inactive')
  const variants = activeVariants.length ? activeVariants : listing.variants || []
  const primary = variants.find((v) => (v.stock || 0) > 0) || variants[0]

  const colorNames = [
    ...new Set(variants.map((v) => pickAttr(v.attributes, ['color', 'colour'])).filter(Boolean)),
  ]
  const sizeNames = [
    ...new Set(variants.map((v) => pickAttr(v.attributes, ['size'])).filter(Boolean)),
  ]

  const colors = colorNames.map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    swatch: swatchFor(name),
  }))

  const images = pickImages(listing)
  const brand = brandFromDescription(listing.description) || listing.category?.name || ''
  const stock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
  const price = Number(primary?.price ?? 0)
  const categoryName = listing.category?.name || 'Marketplace'
  const categorySlug = (listing.category?.slug || categoryName || 'marketplace')
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')

  return {
    id: listing.id,
    listingId: listing.id,
    productId: listing.id,
    variantId: primary?.id,
    selectedVariantId: primary?.id,
    variants,
    title: listing.title,
    name: listing.title,
    brand,
    description: listing.description || '',
    status: listing.status,
    price,
    originalPrice: null,
    stock,
    rating: Number(listing.rating ?? listing.averageRating ?? 4.5),
    reviewCount: Number(listing.reviewCount ?? listing.reviews?.length ?? 0),
    reviews: listing.reviews || [],
    images,
    badges: listing.status === 'active' ? ['In Stock'] : [],
    colors,
    defaultColorId: colors[0]?.id,
    colorLabel: colors.length ? 'Select color' : undefined,
    sizes: sizeNames,
    defaultSize: sizeNames[0],
    sizeLabel: sizeNames.length ? 'Size' : undefined,
    seller: {
      name: listing.seller?.shopName || listing.seller?.name || 'Marketplace Seller',
      verified: true,
      feedback: 'Marketplace seller',
      shopSlug: listing.seller?.shopUrl || listing.seller?.shopSlug || 'marketplace',
    },
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: categoryName, to: `/category/${categorySlug}` },
      { label: listing.title, to: null },
    ],
    featureCards: [],
    highlights: listing.description
      ? listing.description
          .split(/[.|•]/)
          .map((part) => part.trim())
          .filter((part) => part.length > 12)
          .slice(0, 4)
      : [],
    specifications: [
      { label: 'Category', value: categoryName },
      { label: 'Seller', value: listing.seller?.shopName || 'Marketplace Seller' },
      { label: 'SKU', value: primary?.sku || '—' },
      { label: 'Status', value: listing.status || 'active' },
      ...Object.entries(primary?.attributes || {}).map(([label, value]) => ({
        label,
        value: String(value),
      })),
    ],
    relatedProducts: [],
  }
}

export function resolveVariantId(product, colorName = '', sizeName = '') {
  const variants = product?.variants || []
  if (!variants.length) return product?.variantId ?? product?.selectedVariantId

  const color = String(colorName || '').toLowerCase()
  const size = String(sizeName || '').toLowerCase()

  const matched =
    variants.find((variant) => {
      const attrs = attrMap(variant.attributes)
      const colorOk =
        !color ||
        Object.values(attrs).some((value) => String(value).toLowerCase() === color) ||
        attrs.color === color ||
        attrs.colour === color
      const sizeOk =
        !size ||
        Object.values(attrs).some((value) => String(value).toLowerCase() === size) ||
        attrs.size === size
      return colorOk && sizeOk && (variant.stock || 0) > 0
    }) ||
    variants.find((variant) => {
      const attrs = attrMap(variant.attributes)
      const colorOk =
        !color || Object.values(attrs).some((value) => String(value).toLowerCase() === color)
      const sizeOk =
        !size || Object.values(attrs).some((value) => String(value).toLowerCase() === size)
      return colorOk && sizeOk
    }) ||
    variants.find((variant) => (variant.stock || 0) > 0) ||
    variants[0]

  return matched?.id ?? product?.variantId ?? product?.selectedVariantId
}
