/** Mock listings per category — no product images (empty string). */

function item(id, brand, name, price, categorySlug, extra = {}) {
  return {
    id,
    brand,
    name,
    price,
    categorySlug,
    image: '',
    originalPrice: extra.originalPrice ?? null,
    rating: extra.rating ?? 4.6,
    reviews: extra.reviews ?? 80,
    badge: extra.badge,
    categoryLabel: extra.categoryLabel,
  }
}

export const electronicsProducts = [
  item('sony-wh-1000xm5', 'SONY', 'WH-1000XM5 Wireless Headphones', 97750, 'electronics', {
    originalPrice: 115000,
    rating: 4.8,
    reviews: 342,
    badge: { label: '-16%', type: 'sale' },
  }),
  item('apple-airpods-pro', 'APPLE', 'AirPods Pro (2nd Generation)', 64990, 'electronics', {
    rating: 4.9,
    reviews: 512,
    badge: { label: 'NEW', type: 'new' },
  }),
  item('samsung-galaxy-s24', 'SAMSUNG', 'Galaxy S24 Ultra 256GB', 289990, 'electronics', {
    originalPrice: 319990,
    rating: 4.7,
    reviews: 128,
    badge: { label: '-9%', type: 'sale' },
  }),
  item('ultra-smart-watch-pro-10', 'APPLE', 'Ultra-Smart Watch Pro Series 10', 45990, 'electronics', {
    originalPrice: 57500,
    rating: 4.8,
    reviews: 128,
    badge: { label: '-20%', type: 'sale' },
  }),
  item('macbook-air-m3', 'APPLE', 'MacBook Air 13" M3 Chip', 324990, 'electronics', {
    rating: 4.9,
    reviews: 89,
    badge: { label: 'NEW', type: 'new' },
  }),
  item('logitech-mx-master', 'LOGITECH', 'MX Master 3S Wireless Mouse', 28500, 'electronics', {
    originalPrice: 32000,
    rating: 4.6,
    reviews: 76,
    badge: { label: '-11%', type: 'sale' },
  }),
  item('jbl-flip-6', 'JBL', 'Flip 6 Portable Bluetooth Speaker', 34990, 'electronics', {
    rating: 4.5,
    reviews: 203,
  }),
  item('canon-eos-r50', 'CANON', 'EOS R50 Mirrorless Camera Kit', 198990, 'electronics', {
    originalPrice: 215000,
    rating: 4.7,
    reviews: 45,
    badge: { label: '-7%', type: 'sale' },
  }),
  item('ipad-air', 'APPLE', 'iPad Air 11" Wi-Fi 128GB', 174990, 'electronics', {
    rating: 4.8,
    reviews: 167,
    badge: { label: 'NEW', type: 'new' },
  }),
  item('dell-xps-15', 'DELL', 'XPS 15 OLED Laptop', 425000, 'electronics', {
    originalPrice: 459000,
    rating: 4.6,
    reviews: 34,
    badge: { label: '-7%', type: 'sale' },
  }),
  item('anker-powerbank', 'ANKER', '737 Power Bank 24,000mAh', 24990, 'electronics', {
    rating: 4.7,
    reviews: 291,
  }),
  item('lg-oled-tv', 'LG', '55" C3 OLED 4K Smart TV', 389990, 'electronics', {
    originalPrice: 425000,
    rating: 4.9,
    reviews: 58,
    badge: { label: '-8%', type: 'sale' },
  }),
]

export const fashionProducts = [
  item('fashion-linen-shirt', 'H&M', 'Men\'s Linen Blend Shirt', 4990, 'fashion', {
    originalPrice: 6500,
    badge: { label: '-23%', type: 'sale' },
  }),
  item('fashion-denim-jacket', 'LEVI\'S', 'Classic Denim Jacket', 12990, 'fashion', { rating: 4.7, reviews: 210 }),
  item('fashion-saree', 'NANDI', 'Handloom Cotton Saree', 18500, 'fashion', {
    badge: { label: 'NEW', type: 'new' },
    rating: 4.9,
    reviews: 64,
  }),
  item('fashion-sneakers', 'NIKE', 'Air Max Running Sneakers', 24990, 'fashion', {
    originalPrice: 28990,
    badge: { label: '-14%', type: 'sale' },
  }),
  item('fashion-handbag', 'CHARLES & KEITH', 'Structured Tote Handbag', 15990, 'fashion', { rating: 4.8, reviews: 142 }),
  item('fashion-kids-set', 'MINI MODE', 'Kids Cotton Co-ord Set', 3990, 'fashion', { rating: 4.5, reviews: 88 }),
]

export const groceriesProducts = [
  item('groc-rice-5kg', 'ARALYA', 'Premium Nadu Rice 5kg', 2450, 'groceries', { reviews: 520 }),
  item('groc-coconut-oil', 'MARVELLA', 'Virgin Coconut Oil 1L', 1890, 'groceries', {
    originalPrice: 2200,
    badge: { label: '-14%', type: 'sale' },
  }),
  item('groc-tea', 'DILMAH', 'Premium Ceylon Tea 100 Bags', 1290, 'groceries', { rating: 4.9, reviews: 890 }),
  item('groc-milk-powder', 'ANCHOR', 'Full Cream Milk Powder 400g', 1650, 'groceries', { reviews: 340 }),
  item('groc-snack-box', 'MALIBAN', 'Assorted Biscuit Family Pack', 990, 'groceries', {
    badge: { label: 'NEW', type: 'new' },
  }),
  item('groc-spice-kit', 'MD', 'Curry Powder Variety Pack', 750, 'groceries', { rating: 4.7, reviews: 156 }),
]

export const homeProducts = [
  item('home-bedsheet', 'DREAM HOME', 'Cotton Bedsheet Set (Queen)', 6990, 'home', {
    originalPrice: 8990,
    badge: { label: '-22%', type: 'sale' },
  }),
  item('home-cookware', 'PRESTIGE', 'Non-Stick Cookware Set 5pc', 12490, 'home', { rating: 4.6, reviews: 98 }),
  item('home-lamp', 'PHILIPS', 'LED Desk Lamp with USB Port', 5490, 'home', { badge: { label: 'NEW', type: 'new' } }),
  item('home-curtains', 'STYLE LIVING', 'Blackout Curtain Pair', 8990, 'home', { reviews: 67 }),
  item('home-storage', 'IKEA LK', 'Stackable Storage Boxes (3)', 4590, 'home', { rating: 4.5, reviews: 201 }),
  item('home-vacuum', 'BLACK+DECKER', 'Compact Vacuum Cleaner', 18990, 'home', {
    originalPrice: 21990,
    badge: { label: '-14%', type: 'sale' },
  }),
]

export const beautyProducts = [
  item('beauty-serum', 'THE ORDINARY', 'Hyaluronic Acid Serum 30ml', 4200, 'beauty', { rating: 4.8, reviews: 312 }),
  item('beauty-lipstick', 'MAC', 'Matte Lipstick – Ruby Woo', 6500, 'beauty', { badge: { label: 'NEW', type: 'new' } }),
  item('beauty-sunscreen', 'NEUTROGENA', 'SPF 50+ Ultra Sheer 88ml', 3800, 'beauty', { reviews: 445 }),
  item('beauty-perfume', 'VERSACE', 'Bright Crystal EDT 90ml', 18500, 'beauty', {
    originalPrice: 22000,
    badge: { label: '-16%', type: 'sale' },
  }),
  item('beauty-shampoo', 'LOREAL', 'Total Repair Shampoo 400ml', 1890, 'beauty', { rating: 4.4, reviews: 178 }),
  item('beauty-face-mask', 'GARNIER', 'Sheet Mask Pack of 5', 1290, 'beauty', { reviews: 92 }),
]

export const sportsProducts = [
  item('sports-yoga-mat', 'DECATHLON', 'Non-Slip Yoga Mat 6mm', 4990, 'sports', { rating: 4.7, reviews: 134 }),
  item('sports-dumbbell', 'PRO FITNESS', 'Adjustable Dumbbell Pair 20kg', 24990, 'sports', {
    originalPrice: 27990,
    badge: { label: '-11%', type: 'sale' },
  }),
  item('sports-cricket-bat', 'SS', 'English Willow Cricket Bat', 15990, 'sports', { rating: 4.8, reviews: 56 }),
  item('sports-football', 'NIKE', 'Strike Football Size 5', 5990, 'sports', { reviews: 89 }),
  item('sports-gym-bag', 'ADIDAS', 'Training Gym Bag 50L', 8990, 'sports', { badge: { label: 'NEW', type: 'new' } }),
  item('sports-bottle', 'WILSON', 'Insulated Sports Water Bottle 750ml', 2490, 'sports', { reviews: 210 }),
]

export const kidsProducts = [
  item('kids-building-blocks', 'LEGO', 'Creative Building Blocks Set', 8990, 'kids', {
    rating: 4.9,
    reviews: 280,
    badge: { label: 'NEW', type: 'new' },
  }),
  item('kids-stuffed-bear', 'SOFT TOYS', 'Plush Teddy Bear Large', 3490, 'kids', { reviews: 145 }),
  item('kids-scooter', 'MICRO', 'Kids 3-Wheel Scooter', 12990, 'kids', {
    originalPrice: 14990,
    badge: { label: '-13%', type: 'sale' },
  }),
  item('kids-story-books', 'SCHOLASTIC', 'Story Book Bundle (5)', 2990, 'kids', { rating: 4.8, reviews: 67 }),
  item('kids-art-kit', 'CRAYOLA', 'Ultimate Art & Craft Kit', 5490, 'kids', { reviews: 112 }),
  item('kids-puzzle', 'RAVENSBURGER', 'World Map Jigsaw Puzzle 100pc', 3990, 'kids', { rating: 4.6, reviews: 43 }),
]

export const productsByCategorySlug = {
  electronics: electronicsProducts,
  fashion: fashionProducts,
  groceries: groceriesProducts,
  home: homeProducts,
  beauty: beautyProducts,
  sports: sportsProducts,
  kids: kidsProducts,
}
