# Cloudflare image hosting

Frontend product and hero images load from **Cloudflare** when `VITE_CDN_BASE_URL` is set. Without it, image slots stay empty (neutral placeholders) until you upload assets to R2.

## Recommended setup: R2 + public access

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2** → create a bucket (e.g. `dcc-assets`).
2. Upload images keeping the folder structure below.
3. Enable **Public access** for the bucket (R2.dev subdomain or connect a custom domain).
4. Copy the public base URL into `Frontend/.env`:

```bash
VITE_CDN_BASE_URL=https://pub-xxxxxxxx.r2.dev/dcc-assets
```

5. Restart the dev server: `npm run dev`

## File paths to upload

| Path on R2 | Used for |
|------------|----------|
| `home/hero-summer-collection.jpg` | Homepage hero banner |
| `products/headphones.jpg` | Headphones / search best match |
| `products/airpods.jpg` | AirPods |
| `products/smartphone.jpg` | Galaxy / phones |
| `products/smartwatch.jpg` | Smartwatch |
| `products/macbook.jpg` | MacBook |
| `products/mouse.jpg` | Mouse |
| `products/speaker.jpg` | Bluetooth speaker |
| `products/camera.jpg` | Camera |
| `products/ipad.jpg` | iPad |
| `products/laptop.jpg` | Laptop |
| `products/powerbank.jpg` | Power bank |
| `products/tv.jpg` | TV |
| `products/smartwatch-silver.jpg` | Product detail gallery |
| `products/smartwatch-black.jpg` | Product detail gallery |
| `products/sunglasses.jpg` | Related product |
| `products/headphones-bose.jpg` | Search results |
| `products/earbuds.jpg` | Earbuds |
| `products/headphones-sennheiser.jpg` | Search results |
| `shops/tech-world-store.jpg` | Category “Top shops” featured card |

Export assets from your Figma/mockups and upload them to R2 using the paths below.

## Optional: resize on the fly

If the CDN hostname is proxied through Cloudflare (orange cloud), width variants use:

`/cdn-cgi/image/width=600,quality=85,format=auto/products/headphones.jpg`

The app sets this automatically when `VITE_CDN_BASE_URL` is configured.

## Code reference

- URL helper: `src/config/images.js`
- Env variable: `VITE_CDN_BASE_URL`
