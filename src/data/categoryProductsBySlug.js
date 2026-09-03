import { IMG } from '../config/images'

const productSpecificImages = {
  // Electronics (refer to local image assets)
  'sony-wh-1000xm5': IMG.products.headphones,
  'apple-airpods-pro': IMG.products.airpods,
  'samsung-galaxy-s24': IMG.products.smartphone,
  'ultra-smart-watch-pro-10': IMG.products.smartwatch,
  'macbook-air-m3': IMG.products.macbook,
  'logitech-mx-master': IMG.products.mouse,
  'jbl-flip-6': IMG.products.speaker,
  'canon-eos-r50': IMG.products.camera,
  'ipad-air': IMG.products.ipad,
  'dell-xps-15': IMG.products.laptop,
  'anker-powerbank': IMG.products.powerbank,
  'lg-oled-tv': IMG.products.tv,
  'bose-qc45': IMG.products.headphonesBose,
  'sony-linkbuds': IMG.products.earbuds,
  'sennheiser-hd-450': IMG.products.headphonesSennheiser,

  // Fashion
  'fashion-linen-shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=60',
  'fashion-denim-jacket': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop&q=60',
  'fashion-saree': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=60',
  'fashion-sneakers': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60',
  'fashion-handbag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=60',
  'fashion-kids-set': 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=400&auto=format&fit=crop&q=60',

  // Groceries
  'groc-rice-5kg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60',
  'groc-coconut-oil': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format&fit=crop&q=60',
  'groc-tea': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop&q=60',
  'groc-milk-powder': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=60',
  'groc-snack-box': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=60',
  'groc-spice-kit': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=60',

  // Home & Living
  'home-bedsheet': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop&q=60',
  'home-cookware': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=60',
  'home-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=60',
  'home-curtains': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60',
  'home-storage': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&auto=format&fit=crop&q=60',
  'home-vacuum': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&auto=format&fit=crop&q=60',

  // Beauty
  'beauty-serum': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60',
  'beauty-lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=60',
  'beauty-sunscreen': '/images/products/beauty-sunscreen.png',
  'beauty-perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=60',
  'beauty-shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=60',
  'beauty-face-mask': '/images/products/beauty-face-mask.png',

  // Sports
  'sports-yoga-mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&auto=format&fit=crop&q=60',
  'sports-dumbbell': 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&auto=format&fit=crop&q=60',
  'sports-cricket-bat': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60',
  'sports-football': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60',
  'sports-gym-bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=60',
  'sports-bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=60',

  // Kids
  'kids-building-blocks': 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=60',
  'kids-stuffed-bear': 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400&auto=format&fit=crop&q=60',
  'kids-scooter': '/images/products/kids-scooter.png',
  'kids-story-books': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&auto=format&fit=crop&q=60',
  'kids-art-kit': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60',
  'kids-puzzle': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&auto=format&fit=crop&q=60',
}

const categoryFallbacks = {
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60',
  home: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=60',
  sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60',
  kids: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&auto=format&fit=crop&q=60',
}

function item(id, brand, name, price, categorySlug, extra = {}) {
  const specificImage = productSpecificImages[id]
  const fallbackImage = categoryFallbacks[categorySlug] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60'

  return {
    id,
    brand,
    name,
    price,
    categorySlug,
    image: specificImage || fallbackImage,
    originalPrice: extra.originalPrice ?? null,
    rating: extra.rating ?? 4.6,
    reviews: extra.reviews ?? 80,
    badge: extra.badge,
    categoryLabel: extra.categoryLabel,
    shopId: extra.shopId ?? null,
  }
}

export const electronicsProducts = [
  item('sony-wh-1000xm5', 'SONY', 'WH-1000XM5 Wireless Headphones', 97750, 'electronics', {
    originalPrice: 115000,
    rating: 4.8,
    reviews: 342,
    badge: { label: '-16%', type: 'sale' },
    shopId: 'tech-world-lk',
  }),
  item('apple-airpods-pro', 'APPLE', 'AirPods Pro (2nd Generation)', 64990, 'electronics', {
    rating: 4.9,
    reviews: 512,
    badge: { label: 'NEW', type: 'new' },
    shopId: 'gadget-master',
  }),
  item('samsung-galaxy-s24', 'SAMSUNG', 'Galaxy S24 Ultra 256GB', 289990, 'electronics', {
    originalPrice: 319990,
    rating: 4.7,
    reviews: 128,
    badge: { label: '-9%', type: 'sale' },
    shopId: 'mobile-hub',
  }),
  item('ultra-smart-watch-pro-10', 'APPLE', 'Ultra-Smart Watch Pro Series 10', 45990, 'electronics', {
    originalPrice: 57500,
    rating: 4.8,
    reviews: 128,
    badge: { label: '-20%', type: 'sale' },
    shopId: 'tech-world-lk',
  }),
  item('macbook-air-m3', 'APPLE', 'MacBook Air 13" M3 Chip', 324990, 'electronics', {
    rating: 4.9,
    reviews: 89,
    badge: { label: 'NEW', type: 'new' },
    shopId: 'gadget-master',
  }),
  item('logitech-mx-master', 'LOGITECH', 'MX Master 3S Wireless Mouse', 28500, 'electronics', {
    originalPrice: 32000,
    rating: 4.6,
    reviews: 76,
    badge: { label: '-11%', type: 'sale' },
    shopId: 'mobile-hub',
  }),
  item('jbl-flip-6', 'JBL', 'Flip 6 Portable Bluetooth Speaker', 34990, 'electronics', {
    rating: 4.5,
    reviews: 203,
    shopId: 'tech-world-lk',
  }),
  item('canon-eos-r50', 'CANON', 'EOS R50 Mirrorless Camera Kit', 198990, 'electronics', {
    originalPrice: 215000,
    rating: 4.7,
    reviews: 45,
    badge: { label: '-7%', type: 'sale' },
    shopId: 'gadget-master',
  }),
  item('ipad-air', 'APPLE', 'iPad Air 11" Wi-Fi 128GB', 174990, 'electronics', {
    rating: 4.8,
    reviews: 167,
    badge: { label: 'NEW', type: 'new' },
    shopId: 'mobile-hub',
  }),
  item('dell-xps-15', 'DELL', 'XPS 15 OLED Laptop', 425000, 'electronics', {
    originalPrice: 459000,
    rating: 4.6,
    reviews: 34,
    badge: { label: '-7%', type: 'sale' },
    shopId: 'tech-world-lk',
  }),
  item('anker-powerbank', 'ANKER', '737 Power Bank 24,000mAh', 24990, 'electronics', {
    rating: 4.7,
    reviews: 291,
    shopId: 'gadget-master',
  }),
  item('lg-oled-tv', 'LG', '55" C3 OLED 4K Smart TV', 389990, 'electronics', {
    originalPrice: 425000,
    rating: 4.9,
    reviews: 58,
    badge: { label: '-8%', type: 'sale' },
    shopId: 'mobile-hub',
  }),
]

export const fashionProducts = [
  item('fashion-linen-shirt', 'H&M', 'Men\'s Linen Blend Shirt', 4990, 'fashion', {
    originalPrice: 6500,
    badge: { label: '-23%', type: 'sale' },
    shopId: 'fashion-hub',
  }),
  item('fashion-denim-jacket', 'LEVI\'S', 'Classic Denim Jacket', 12990, 'fashion', { rating: 4.7, reviews: 210, shopId: 'style-street' }),
  item('fashion-saree', 'NANDI', 'Handloom Cotton Saree', 18500, 'fashion', {
    badge: { label: 'NEW', type: 'new' },
    rating: 4.9,
    reviews: 64,
    shopId: 'urban-wear',
  }),
  item('fashion-sneakers', 'NIKE', 'Air Max Running Sneakers', 24990, 'fashion', {
    originalPrice: 28990,
    badge: { label: '-14%', type: 'sale' },
    shopId: 'fashion-hub',
  }),
  item('fashion-handbag', 'CHARLES & KEITH', 'Structured Tote Handbag', 15990, 'fashion', { rating: 4.8, reviews: 142, shopId: 'style-street' }),
  item('fashion-kids-set', 'MINI MODE', 'Kids Cotton Co-ord Set', 3990, 'fashion', { rating: 4.5, reviews: 88, shopId: 'urban-wear' }),
]

export const groceriesProducts = [
  item('groc-rice-5kg', 'ARALYA', 'Premium Nadu Rice 5kg', 2450, 'groceries', { reviews: 520, shopId: 'green-grocer' }),
  item('groc-coconut-oil', 'MARVELLA', 'Virgin Coconut Oil 1L', 1890, 'groceries', {
    originalPrice: 2200,
    badge: { label: '-14%', type: 'sale' },
    shopId: 'daily-mart',
  }),
  item('groc-tea', 'DILMAH', 'Premium Ceylon Tea 100 Bags', 1290, 'groceries', { rating: 4.9, reviews: 890, shopId: 'ceylon-foods' }),
  item('groc-milk-powder', 'ANCHOR', 'Full Cream Milk Powder 400g', 1650, 'groceries', { reviews: 340, shopId: 'green-grocer' }),
  item('groc-snack-box', 'MALIBAN', 'Assorted Biscuit Family Pack', 990, 'groceries', {
    badge: { label: 'NEW', type: 'new' },
    shopId: 'daily-mart',
  }),
  item('groc-spice-kit', 'MD', 'Curry Powder Variety Pack', 750, 'groceries', { rating: 4.7, reviews: 156, shopId: 'ceylon-foods' }),
]

export const homeProducts = [
  item('home-bedsheet', 'DREAM HOME', 'Cotton Bedsheet Set (Queen)', 6990, 'home', {
    originalPrice: 8990,
    badge: { label: '-22%', type: 'sale' },
    shopId: 'home-essentials',
  }),
  item('home-cookware', 'PRESTIGE', 'Non-Stick Cookware Set 5pc', 12490, 'home', { rating: 4.6, reviews: 98, shopId: 'cozy-living' }),
  item('home-lamp', 'PHILIPS', 'LED Desk Lamp with USB Port', 5490, 'home', { badge: { label: 'NEW', type: 'new' }, shopId: 'kitchen-pro' }),
  item('home-curtains', 'STYLE LIVING', 'Blackout Curtain Pair', 8990, 'home', { reviews: 67, shopId: 'home-essentials' }),
  item('home-storage', 'IKEA LK', 'Stackable Storage Boxes (3)', 4590, 'home', { rating: 4.5, reviews: 201, shopId: 'cozy-living' }),
  item('home-vacuum', 'BLACK+DECKER', 'Compact Vacuum Cleaner', 18990, 'home', {
    originalPrice: 21990,
    badge: { label: '-14%', type: 'sale' },
    shopId: 'kitchen-pro',
  }),
]

export const beautyProducts = [
  item('beauty-serum', 'THE ORDINARY', 'Hyaluronic Acid Serum 30ml', 4200, 'beauty', { rating: 4.8, reviews: 312, shopId: 'glow-beauty' }),
  item('beauty-lipstick', 'MAC', 'Matte Lipstick – Ruby Woo', 6500, 'beauty', { badge: { label: 'NEW', type: 'new' }, shopId: 'pure-skin' }),
  item('beauty-sunscreen', 'NEUTROGENA', 'SPF 50+ Ultra Sheer 88ml', 3800, 'beauty', { reviews: 445, shopId: 'glam-studio' }),
  item('beauty-perfume', 'VERSACE', 'Bright Crystal EDT 90ml', 18500, 'beauty', {
    originalPrice: 22000,
    badge: { label: '-16%', type: 'sale' },
    shopId: 'glow-beauty',
  }),
  item('beauty-shampoo', 'LOREAL', 'Total Repair Shampoo 400ml', 1890, 'beauty', { rating: 4.4, reviews: 178, shopId: 'pure-skin' }),
  item('beauty-face-mask', 'GARNIER', 'Sheet Mask Pack of 5', 1290, 'beauty', { reviews: 92, shopId: 'glam-studio' }),
]

export const sportsProducts = [
  item('sports-yoga-mat', 'DECATHLON', 'Non-Slip Yoga Mat 6mm', 4990, 'sports', { rating: 4.7, reviews: 134, shopId: 'active-zone' }),
  item('sports-dumbbell', 'PRO FITNESS', 'Adjustable Dumbbell Pair 20kg', 24990, 'sports', {
    originalPrice: 27990,
    badge: { label: '-11%', type: 'sale' },
    shopId: 'fit-life',
  }),
  item('sports-cricket-bat', 'SS', 'English Willow Cricket Bat', 15990, 'sports', { rating: 4.8, reviews: 56, shopId: 'sport-max' }),
  item('sports-football', 'NIKE', 'Strike Football Size 5', 5990, 'sports', { reviews: 89, shopId: 'active-zone' }),
  item('sports-gym-bag', 'ADIDAS', 'Training Gym Bag 50L', 8990, 'sports', { badge: { label: 'NEW', type: 'new' }, shopId: 'fit-life' }),
  item('sports-bottle', 'WILSON', 'Insulated Sports Water Bottle 750ml', 2490, 'sports', { reviews: 210, shopId: 'sport-max' }),
]

export const kidsProducts = [
  item('kids-building-blocks', 'LEGO', 'Creative Building Blocks Set', 8990, 'kids', {
    rating: 4.9,
    reviews: 280,
    badge: { label: 'NEW', type: 'new' },
    shopId: 'little-joy',
  }),
  item('kids-stuffed-bear', 'SOFT TOYS', 'Plush Teddy Bear Large', 3490, 'kids', { reviews: 145, shopId: 'playtime' }),
  item('kids-scooter', 'MICRO', 'Kids 3-Wheel Scooter', 12990, 'kids', {
    originalPrice: 14990,
    badge: { label: '-13%', type: 'sale' },
    shopId: 'bookworms',
  }),
  item('kids-story-books', 'SCHOLASTIC', 'Story Book Bundle (5)', 2990, 'kids', { rating: 4.8, reviews: 67, shopId: 'little-joy' }),
  item('kids-art-kit', 'CRAYOLA', 'Ultimate Art & Craft Kit', 5490, 'kids', { reviews: 112, shopId: 'playtime' }),
  item('kids-puzzle', 'RAVENSBURGER', 'World Map Jigsaw Puzzle 100pc', 3990, 'kids', { rating: 4.6, reviews: 43, shopId: 'bookworms' }),
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
