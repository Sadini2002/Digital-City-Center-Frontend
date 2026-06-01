/**
 * Product & marketing images — Cloudflare R2 / CDN only.
 *
 * Set in Frontend/.env:
 *   VITE_CDN_BASE_URL=https://pub-xxxx.r2.dev/dcc-assets
 *
 * Upload files under the same paths, e.g. dcc-assets/home/hero-summer-collection.jpg
 * Without VITE_CDN_BASE_URL, image URLs are empty (UI shows neutral placeholders).
 */

const CDN_BASE = (import.meta.env.VITE_CDN_BASE_URL || '').replace(/\/$/, '')

/**
 * @param {string} path - e.g. "products/headphones.jpg"
 * @param {{ width?: number }} [options]
 */
export function imageUrl(path, options = {}) {
  if (!CDN_BASE) return ''

  const normalized = path.replace(/^\//, '')
  let url = `${CDN_BASE}/${normalized}`

  if (options.width) {
    url = `${CDN_BASE}/cdn-cgi/image/width=${options.width},quality=85,format=auto/${normalized}`
  }

  return url
}

/** Pre-built CDN paths used across the app */
export const IMG = {
  home: {
    heroSummer: imageUrl('home/hero-summer-collection.jpg', { width: 900 }),
  },
  products: {
    headphones: imageUrl('products/headphones.jpg', { width: 600 }),
    airpods: imageUrl('products/airpods.jpg', { width: 600 }),
    smartphone: imageUrl('products/smartphone.jpg', { width: 600 }),
    smartwatch: imageUrl('products/smartwatch.jpg', { width: 600 }),
    macbook: imageUrl('products/macbook.jpg', { width: 600 }),
    mouse: imageUrl('products/mouse.jpg', { width: 600 }),
    speaker: imageUrl('products/speaker.jpg', { width: 600 }),
    camera: imageUrl('products/camera.jpg', { width: 600 }),
    ipad: imageUrl('products/ipad.jpg', { width: 600 }),
    laptop: imageUrl('products/laptop.jpg', { width: 600 }),
    powerbank: imageUrl('products/powerbank.jpg', { width: 600 }),
    tv: imageUrl('products/tv.jpg', { width: 600 }),
    smartwatchSilver: imageUrl('products/smartwatch-silver.jpg', { width: 800 }),
    smartwatchBlack: imageUrl('products/smartwatch-black.jpg', { width: 800 }),
    sunglasses: imageUrl('products/sunglasses.jpg', { width: 400 }),
    headphonesBose: imageUrl('products/headphones-bose.jpg', { width: 600 }),
    earbuds: imageUrl('products/earbuds.jpg', { width: 600 }),
    headphonesSennheiser: imageUrl('products/headphones-sennheiser.jpg', { width: 600 }),
  },
  shops: {
    techWorld: imageUrl('shops/tech-world-store.jpg', { width: 800 }),
  },
}

export function isCdnConfigured() {
  return Boolean(CDN_BASE)
}
