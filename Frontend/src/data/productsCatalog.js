import { getAllCategoryListings, getCategoryMeta } from '../components/category/categoryData'
import { searchResults } from '../components/search/searchData'
import { IMG } from '../config/images'

const SELLER = {
  name: 'Tech World LK',
  verified: true,
  feedback: '98% Positive Feedback',
  shopSlug: 'tech-world-lk',
}

const DEFAULT_REVIEWS = [
  {
    id: '1',
    author: 'Amara M.',
    initials: 'AM',
    rating: 5,
    date: '2 days ago',
    body: 'Excellent product and fast delivery to Colombo. Packaging was secure and the item matched the description.',
  },
  {
    id: '2',
    author: 'Nimal P.',
    initials: 'NP',
    rating: 5,
    date: '1 week ago',
    body: 'Great value for money. Seller was responsive and the warranty registration was straightforward.',
  },
]

/** @type {Record<string, object>} */
const PRODUCT_EXTENSIONS = {
  'sony-wh-1000xm5': {
    images: [IMG.products.headphones],
    stock: 24,
    colors: [
      { id: 'black', name: 'Black', swatch: '#1f2937' },
      { id: 'silver', name: 'Silver', swatch: '#d1d5db' },
    ],
    defaultColorId: 'black',
    sizes: [],
    description:
      'Industry-leading noise canceling with Auto NC Optimizer, crystal-clear hands-free calling, and up to 30 hours of battery life. The WH-1000XM5 delivers premium comfort for travel, work, and everyday listening.',
    featureCards: [
      {
        title: 'Noise Canceling',
        description: 'Dual processors and eight microphones for immersive quiet anywhere.',
        icon: 'heart',
      },
      {
        title: 'All-day battery',
        description: 'Up to 30 hours playback with quick charge support.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Auto NC Optimizer adapts to your environment',
      'Speak-to-Chat pauses music when you talk',
      'Multipoint connection for two devices',
      'Lightweight design with soft-fit leather',
    ],
    specifications: [
      { label: 'Driver', value: '30mm dynamic' },
      { label: 'Battery', value: 'Up to 30 hours (NC on)' },
      { label: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm wired' },
      { label: 'Weight', value: '250 g' },
      { label: 'Warranty', value: '1 year official' },
    ],
    relatedIds: ['apple-airpods-pro', 'bose-qc45'],
  },
  'apple-airpods-pro': {
    images: [IMG.products.airpods],
    stock: 40,
    colors: [{ id: 'white', name: 'White', swatch: '#f8fafc' }],
    defaultColorId: 'white',
    sizes: [],
    description:
      'AirPods Pro (2nd generation) with Active Noise Cancellation, Adaptive Transparency, and personalized Spatial Audio. Powered by the H2 chip for richer bass and smarter noise control.',
    featureCards: [
      {
        title: 'Active Noise Cancellation',
        description: 'Up to 2× more ANC than the previous generation.',
        icon: 'heart',
      },
      {
        title: 'MagSafe charging',
        description: 'Case supports MagSafe and Qi wireless charging.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Adaptive Audio blends ANC and Transparency',
      'Conversation Awareness lowers media volume',
      'IP54 dust, sweat, and water resistant',
      'Up to 6 hours listening on a single charge',
    ],
    specifications: [
      { label: 'Chip', value: 'Apple H2' },
      { label: 'Battery (buds)', value: 'Up to 6 hours' },
      { label: 'Battery (case)', value: '30 hours total' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Compatibility', value: 'iOS, iPadOS, macOS' },
    ],
    relatedIds: ['sony-wh-1000xm5', 'sony-linkbuds'],
  },
  'samsung-galaxy-s24': {
    images: [IMG.products.smartphone],
    stock: 18,
    colors: [
      { id: 'titanium', name: 'Titanium Gray', swatch: '#6b7280' },
      { id: 'violet', name: 'Cobalt Violet', swatch: '#7c3aed' },
    ],
    defaultColorId: 'titanium',
    sizes: ['256GB', '512GB', '1TB'],
    defaultSize: '256GB',
    sizeLabel: 'Storage',
    description:
      'Galaxy S24 Ultra with a 6.8" QHD+ display, Snapdragon flagship performance, 200MP camera system, and S Pen built in. Built for creators and power users across Sri Lanka.',
    featureCards: [
      {
        title: 'Pro-grade camera',
        description: '200MP wide sensor with AI-enhanced night shots.',
        icon: 'heart',
      },
      {
        title: 'S Pen included',
        description: 'Note, sketch, and control your phone with precision.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Titanium frame with Gorilla Armor glass',
      'Circle to Search with Google',
      '5000mAh battery with 45W fast charge',
      '7 years of OS and security updates',
    ],
    specifications: [
      { label: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { label: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '12 GB' },
      { label: 'Camera', value: '200MP + 50MP + 12MP + 10MP' },
      { label: 'Battery', value: '5000 mAh' },
    ],
    relatedIds: ['apple-airpods-pro', 'anker-powerbank'],
  },
  'ultra-smart-watch-pro-10': {
    images: [IMG.products.smartwatch, IMG.products.smartwatchSilver, IMG.products.smartwatchBlack],
    badges: [
      { label: 'SALE -20%', className: 'bg-red-500' },
      { label: 'HOT', className: 'bg-dcc-primary' },
    ],
    stock: 12,
    colors: [
      { id: 'black', name: 'Midnight Black', swatch: '#1f2937' },
      { id: 'silver', name: 'Titanium Silver', swatch: '#d1d5db' },
      { id: 'gold', name: 'Champagne Gold', swatch: '#d4af37' },
    ],
    defaultColorId: 'silver',
    sizes: ['45mm', '41mm'],
    defaultSize: '45mm',
    sizeLabel: 'Case size',
    description:
      'Experience the next generation of wearable technology with the Ultra-Smart Watch Pro Series 10. Premium titanium finish, advanced health sensors, and seamless connectivity for your daily life.',
    featureCards: [
      {
        title: 'Health Tracking',
        description: 'Heart rate, SpO2, sleep stages, and stress monitoring.',
        icon: 'heart',
      },
      {
        title: 'Battery Life',
        description: 'Up to 18 hours of mixed use with fast magnetic charging.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Always-On Retina OLED display',
      'IP68 water & dust resistance',
      'Crash detection and emergency SOS',
      'On-device voice assistant',
    ],
    specifications: [
      { label: 'Display', value: '1.9" Always-On OLED' },
      { label: 'Case', value: 'Titanium, 45mm' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, Wi-Fi, GPS' },
      { label: 'Battery', value: 'Up to 18 hours' },
    ],
    relatedIds: ['apple-airpods-pro', 'anker-powerbank'],
  },
  'macbook-air-m3': {
    images: [IMG.products.macbook],
    stock: 8,
    colors: [
      { id: 'midnight', name: 'Midnight', swatch: '#1e293b' },
      { id: 'silver', name: 'Silver', swatch: '#e2e8f0' },
      { id: 'starlight', name: 'Starlight', swatch: '#f5f0e6' },
    ],
    defaultColorId: 'silver',
    sizes: ['256GB', '512GB', '1TB'],
    defaultSize: '256GB',
    sizeLabel: 'Storage',
    description:
      'MacBook Air 13" with the Apple M3 chip, stunning Liquid Retina display, and all-day battery life in an impossibly thin design. Ideal for students and professionals.',
    featureCards: [
      {
        title: 'M3 performance',
        description: '8-core CPU and up to 10-core GPU for smooth multitasking.',
        icon: 'heart',
      },
      {
        title: 'Silent design',
        description: 'Fanless aluminum enclosure stays cool and quiet.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Up to 18 hours battery life',
      '1080p FaceTime HD camera',
      'MagSafe 3 charging',
      'Two Thunderbolt / USB 4 ports',
    ],
    specifications: [
      { label: 'Chip', value: 'Apple M3' },
      { label: 'Display', value: '13.6" Liquid Retina' },
      { label: 'Memory', value: '8 GB unified (configurable)' },
      { label: 'Weight', value: '1.24 kg' },
      { label: 'Warranty', value: '1 year Apple limited' },
    ],
    relatedIds: ['dell-xps-15', 'logitech-mx-master'],
  },
  'logitech-mx-master': {
    images: [IMG.products.mouse],
    stock: 35,
    colors: [
      { id: 'graphite', name: 'Graphite', swatch: '#374151' },
      { id: 'pale', name: 'Pale Gray', swatch: '#d1d5db' },
    ],
    defaultColorId: 'graphite',
    sizes: [],
    description:
      'MX Master 3S is a precision wireless mouse with quiet clicks, an 8K DPI sensor, and ergonomic sculpting for long work sessions. Connect up to three devices with Easy-Switch.',
    featureCards: [
      {
        title: 'Ergonomic grip',
        description: 'Sculpted shape supports your hand naturally.',
        icon: 'heart',
      },
      {
        title: 'Multi-device',
        description: 'Switch between laptop, tablet, and desktop instantly.',
        icon: 'battery',
      },
    ],
    highlights: [
      'MagSpeed electromagnetic scroll wheel',
      'USB-C quick charging',
      'Works on glass with 8K DPI sensor',
      'Compatible with Logi Options+',
    ],
    specifications: [
      { label: 'Sensor', value: '8K DPI Darkfield' },
      { label: 'Battery', value: 'Up to 70 days' },
      { label: 'Connectivity', value: 'Bluetooth, Logi Bolt USB receiver' },
      { label: 'Buttons', value: '7 customizable' },
    ],
    relatedIds: ['macbook-air-m3', 'dell-xps-15'],
  },
  'jbl-flip-6': {
    images: [IMG.products.speaker],
    stock: 28,
    colors: [
      { id: 'black', name: 'Black', swatch: '#111827' },
      { id: 'blue', name: 'Blue', swatch: '#2563eb' },
      { id: 'pink', name: 'Pink', swatch: '#ec4899' },
    ],
    defaultColorId: 'black',
    sizes: [],
    description:
      'JBL Flip 6 delivers powerful JBL Original Pro Sound with IP67 waterproof and dustproof rating. PartyBoost lets you pair multiple speakers for bigger sound outdoors.',
    featureCards: [
      {
        title: 'Outdoor ready',
        description: 'IP67 rating for pool, beach, and adventure.',
        icon: 'heart',
      },
      {
        title: '12-hour playtime',
        description: 'Built-in battery keeps the music going all day.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Racetrack-shaped driver for punchy bass',
      'USB-C charging',
      'PartyBoost multi-speaker pairing',
      'Bold, portable design with strap',
    ],
    specifications: [
      { label: 'Output power', value: '30 W' },
      { label: 'Battery', value: 'Up to 12 hours' },
      { label: 'Waterproof', value: 'IP67' },
      { label: 'Connectivity', value: 'Bluetooth 5.1' },
    ],
    relatedIds: ['sony-wh-1000xm5', 'apple-airpods-pro'],
  },
  'canon-eos-r50': {
    images: [IMG.products.camera],
    stock: 6,
    colors: [{ id: 'black', name: 'Black', swatch: '#1f2937' }],
    defaultColorId: 'black',
    sizes: ['Body only', 'Kit lens 18-45mm'],
    defaultSize: 'Kit lens 18-45mm',
    sizeLabel: 'Bundle',
    description:
      'Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video, and intuitive controls for creators stepping up from smartphones. Kit includes compact RF-S lens.',
    featureCards: [
      {
        title: '4K video',
        description: 'Oversampled 4K 30p with Canon color science.',
        icon: 'heart',
      },
      {
        title: 'Dual Pixel AF',
        description: 'Reliable face and subject tracking for photos and vlogs.',
        icon: 'battery',
      },
    ],
    highlights: [
      '24.2MP APS-C CMOS sensor',
      'Vari-angle touchscreen LCD',
      'Wi-Fi and Bluetooth connectivity',
      'Lightweight body for travel',
    ],
    specifications: [
      { label: 'Sensor', value: 'APS-C 24.2MP' },
      { label: 'Video', value: '4K 30p, Full HD 120p' },
      { label: 'Mount', value: 'Canon RF' },
      { label: 'Weight', value: 'Approx. 375 g (body)' },
    ],
    relatedIds: ['lg-oled-tv', 'ipad-air'],
  },
  'ipad-air': {
    images: [IMG.products.ipad],
    stock: 14,
    colors: [
      { id: 'blue', name: 'Blue', swatch: '#3b82f6' },
      { id: 'purple', name: 'Purple', swatch: '#a855f7' },
      { id: 'gray', name: 'Space Gray', swatch: '#6b7280' },
    ],
    defaultColorId: 'blue',
    sizes: ['128GB', '256GB', '512GB'],
    defaultSize: '128GB',
    sizeLabel: 'Storage',
    description:
      'iPad Air 11" with M2 chip, Liquid Retina display, and support for Apple Pencil Pro. Perfect for note-taking, creative work, and entertainment on the go.',
    featureCards: [
      {
        title: 'M2 chip',
        description: 'Desktop-class performance in a thin tablet.',
        icon: 'heart',
      },
      {
        title: 'Apple Pencil',
        description: 'Compatible with Apple Pencil Pro and USB-C Pencil.',
        icon: 'battery',
      },
    ],
    highlights: [
      '11" Liquid Retina display',
      'Center Stage on front camera',
      'USB-C with fast data transfer',
      'All-day battery life',
    ],
    specifications: [
      { label: 'Chip', value: 'Apple M2' },
      { label: 'Display', value: '11" Liquid Retina' },
      { label: 'Camera', value: '12MP wide, 12MP front' },
      { label: 'Connectivity', value: 'Wi-Fi 6E, optional 5G' },
    ],
    relatedIds: ['macbook-air-m3', 'apple-airpods-pro'],
  },
  'dell-xps-15': {
    images: [IMG.products.laptop],
    stock: 5,
    colors: [
      { id: 'platinum', name: 'Platinum Silver', swatch: '#e5e7eb' },
      { id: 'graphite', name: 'Graphite', swatch: '#374151' },
    ],
    defaultColorId: 'platinum',
    sizes: ['512GB', '1TB', '2TB'],
    defaultSize: '512GB',
    sizeLabel: 'Storage',
    description:
      'Dell XPS 15 OLED pairs a stunning 3.5K OLED display with Intel Core Ultra processors and NVIDIA graphics for creative professionals who need power and portability.',
    featureCards: [
      {
        title: 'OLED display',
        description: 'Infinite contrast and 100% DCI-P3 color.',
        icon: 'heart',
      },
      {
        title: 'Creator power',
        description: 'Dedicated GPU for video and 3D workloads.',
        icon: 'battery',
      },
    ],
    highlights: [
      'CNC-machined aluminum chassis',
      'Quad-speaker design with Waves Audio',
      'Thunderbolt 4 ports',
      'Windows 11 Pro ready',
    ],
    specifications: [
      { label: 'Display', value: '15.6" 3.5K OLED' },
      { label: 'Processor', value: 'Intel Core Ultra 7' },
      { label: 'Graphics', value: 'NVIDIA GeForce RTX' },
      { label: 'RAM', value: '16 GB (upgradeable)' },
    ],
    relatedIds: ['macbook-air-m3', 'logitech-mx-master'],
  },
  'anker-powerbank': {
    images: [IMG.products.powerbank],
    stock: 50,
    colors: [
      { id: 'black', name: 'Black', swatch: '#111827' },
      { id: 'silver', name: 'Silver', swatch: '#cbd5e1' },
    ],
    defaultColorId: 'black',
    sizes: [],
    description:
      'Anker 737 Power Bank (PowerCore 24K) delivers 140W output to charge laptops, tablets, and phones simultaneously. Smart digital display shows remaining power and port status.',
    featureCards: [
      {
        title: '140W output',
        description: 'Charge MacBook Pro and phones at full speed.',
        icon: 'heart',
      },
      {
        title: '24,000mAh capacity',
        description: 'Multiple full charges for phones and tablets.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Two USB-C and one USB-A port',
      'Smart temperature management',
      'Compact for travel in carry-on',
      'Anker MultiProtect safety system',
    ],
    specifications: [
      { label: 'Capacity', value: '24,000 mAh / 86.4 Wh' },
      { label: 'Max output', value: '140W' },
      { label: 'Ports', value: '2× USB-C, 1× USB-A' },
      { label: 'Weight', value: 'Approx. 630 g' },
    ],
    relatedIds: ['samsung-galaxy-s24', 'apple-airpods-pro'],
  },
  'lg-oled-tv': {
    images: [IMG.products.tv],
    stock: 4,
    sizes: ['55"', '65"', '77"'],
    defaultSize: '55"',
    sizeLabel: 'Screen size',
    colors: [],
    description:
      'LG C3 OLED evo delivers perfect blacks, vibrant color, and a 120Hz refresh rate for movies and gaming. webOS smart platform with all major streaming apps built in.',
    featureCards: [
      {
        title: 'OLED evo panel',
        description: 'Brighter highlights with self-lit pixels.',
        icon: 'heart',
      },
      {
        title: 'Gaming ready',
        description: 'HDMI 2.1 with 4K 120Hz and VRR support.',
        icon: 'battery',
      },
    ],
    highlights: [
      'α9 AI Processor Gen6',
      'Dolby Vision and Dolby Atmos',
      'Four HDMI 2.1 inputs',
      'Wall-mount compatible design',
    ],
    specifications: [
      { label: 'Panel', value: '55" 4K OLED evo' },
      { label: 'Refresh rate', value: '120 Hz' },
      { label: 'HDR', value: 'Dolby Vision, HDR10' },
      { label: 'Smart TV', value: 'webOS 23' },
    ],
    relatedIds: ['canon-eos-r50', 'jbl-flip-6'],
  },
  'bose-qc45': {
    images: [IMG.products.headphonesBose],
    stock: 16,
    colors: [
      { id: 'black', name: 'Black', swatch: '#111827' },
      { id: 'white', name: 'White Smoke', swatch: '#f1f5f9' },
    ],
    defaultColorId: 'black',
    sizes: [],
    description:
      'Bose QuietComfort 45 headphones combine world-class noise cancellation with balanced audio and lightweight comfort for all-day wear.',
    featureCards: [
      {
        title: 'Quiet Mode',
        description: 'Legendary Bose noise cancellation.',
        icon: 'heart',
      },
      {
        title: '24-hour battery',
        description: 'Listen longer between charges.',
        icon: 'battery',
      },
    ],
    highlights: [
      'Aware Mode for ambient sound',
      'TriPort acoustic architecture',
      'SimpleSync for Bose soundbars',
      'Fold-flat carrying case included',
    ],
    specifications: [
      { label: 'Battery', value: 'Up to 24 hours' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Weight', value: '240 g' },
      { label: 'Connectivity', value: 'Bluetooth 5.1' },
    ],
    relatedIds: ['sony-wh-1000xm5', 'sennheiser-hd-450'],
  },
  'jbl-live-660nc': {
    images: [IMG.products.headphonesBose],
    stock: 20,
    colors: [{ id: 'black', name: 'Black', swatch: '#111827' }],
    defaultColorId: 'black',
    sizes: [],
    description:
      'JBL Live 660NC wireless over-ear headphones feature adaptive noise cancelling, JBL Signature Sound, and up to 50 hours of battery with ANC off.',
    highlights: [
      'Ambient Aware and TalkThru modes',
      'Multi-point Bluetooth pairing',
      'Comfort-fit ear cushions',
      'Quick charge: 10 min = 4 hours',
    ],
    specifications: [
      { label: 'Driver', value: '40mm' },
      { label: 'Battery', value: 'Up to 50 hours (ANC off)' },
      { label: 'ANC', value: 'Adaptive noise cancelling' },
    ],
    relatedIds: ['sony-wh-1000xm5', 'beats-studio-pro'],
  },
  'sony-linkbuds': {
    images: [IMG.products.earbuds],
    stock: 22,
    colors: [
      { id: 'white', name: 'White', swatch: '#f8fafc' },
      { id: 'gray', name: 'Gray', swatch: '#9ca3af' },
    ],
    defaultColorId: 'white',
    sizes: [],
    description:
      'Sony LinkBuds S are compact true wireless earbuds with industry-leading noise cancellation, multipoint connection, and IPX4 water resistance.',
    highlights: [
      'Integrated Processor V1',
      'Speak-to-Chat technology',
      'Up to 20 hours total battery',
      'Comfortable ergonomic fit',
    ],
    specifications: [
      { label: 'Driver', value: '5mm' },
      { label: 'Water resistance', value: 'IPX4' },
      { label: 'Codec', value: 'LDAC, AAC' },
    ],
    relatedIds: ['apple-airpods-pro', 'sony-wh-1000xm5'],
  },
  'sennheiser-hd-450': {
    images: [IMG.products.headphonesSennheiser],
    stock: 11,
    colors: [{ id: 'black', name: 'Black', swatch: '#111827' }],
    defaultColorId: 'black',
    sizes: [],
    description:
      'Sennheiser HD 450BT delivers dynamic bass, active noise cancellation, and 30-hour battery life with the renowned Sennheiser sound signature.',
    highlights: [
      'AAC and aptX Low Latency',
      'Foldable design for travel',
      'USB-C fast charging',
      'Built-in voice assistant button',
    ],
    specifications: [
      { label: 'Battery', value: 'Up to 30 hours' },
      { label: 'ANC', value: 'Active noise cancellation' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
    ],
    relatedIds: ['bose-qc45', 'sony-wh-1000xm5'],
  },
  'beats-studio-pro': {
    images: [IMG.products.headphones],
    stock: 19,
    colors: [
      { id: 'black', name: 'Black', swatch: '#111827' },
      { id: 'sand', name: 'Sandstone', swatch: '#d6d3d1' },
      { id: 'navy', name: 'Navy', swatch: '#1e3a5f' },
    ],
    defaultColorId: 'black',
    sizes: [],
    description:
      'Beats Studio Pro feature personalized spatial audio, USB-C lossless audio, and up to 40 hours of battery life with rich, immersive sound.',
    highlights: [
      'Custom acoustic platform',
      'Enhanced ANC and Transparency',
      'One-touch pairing for Apple & Android',
      'Fast Fuel: 10 min = 4 hours',
    ],
    specifications: [
      { label: 'Battery', value: 'Up to 40 hours' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Spatial audio', value: 'Personalized with dynamic head tracking' },
    ],
    relatedIds: ['apple-airpods-pro', 'sony-wh-1000xm5'],
  },
}

const listingsById = new Map()

function registerListing(listing) {
  if (!listing?.id) return
  listingsById.set(listing.id, listing)
}

getAllCategoryListings().forEach(registerListing)
searchResults.forEach(registerListing)

function buildBadges(listing, extension) {
  if (extension.badges?.length) return extension.badges
  if (!listing.badge) return []
  if (listing.badge.type === 'new') {
    return [{ label: 'NEW', className: 'bg-teal-500' }]
  }
  return [{ label: listing.badge.label, className: 'bg-red-500' }]
}

function buildRelated(relatedIds) {
  return (relatedIds ?? [])
    .map((relatedId) => {
      const item = listingsById.get(relatedId)
      if (!item) return null
      return {
        id: item.id,
        title: item.name,
        price: item.price,
        rating: item.rating,
        image: item.image,
      }
    })
    .filter(Boolean)
}

function buildFromListing(listing) {
  const ext = PRODUCT_EXTENSIONS[listing.id] ?? {}
  const reviewCount = listing.reviews ?? listing.sales ?? 0
  const categorySlug = listing.categorySlug || 'electronics'
  const categoryTitle = getCategoryMeta(categorySlug).title

  return {
    id: listing.id,
    title: listing.name,
    brand: listing.brand,
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: categoryTitle, to: `/category/${categorySlug}` },
      { label: listing.name, to: null },
    ],
    images: ext.images?.length ? ext.images : [listing.image].filter(Boolean),
    badges: buildBadges(listing, ext),
    rating: listing.rating,
    reviewCount,
    seller: SELLER,
    price: listing.price,
    originalPrice: listing.originalPrice ?? null,
    stock: ext.stock ?? 15,
    colors: ext.colors ?? [],
    sizes: ext.sizes ?? [],
    defaultColorId: ext.defaultColorId ?? ext.colors?.[0]?.id,
    defaultSize: ext.defaultSize ?? ext.sizes?.[0],
    colorLabel: ext.colorLabel ?? 'Select color',
    sizeLabel: ext.sizeLabel ?? 'Size',
    description: ext.description ?? `${listing.name} — available from ${SELLER.name} with islandwide delivery.`,
    featureCards: ext.featureCards ?? [],
    highlights: ext.highlights ?? [],
    specifications: ext.specifications ?? [],
    reviews: ext.reviews ?? DEFAULT_REVIEWS,
    relatedProducts: buildRelated(ext.relatedIds),
  }
}

const builtProducts = new Map()
listingsById.forEach((listing, id) => {
  builtProducts.set(id, buildFromListing(listing))
})

/**
 * @param {string | undefined} id
 */
export function getProductById(id) {
  if (!id) return null
  return builtProducts.get(id) ?? null
}

export function getAllProductIds() {
  return [...builtProducts.keys()]
}

export function formatLkr(amount) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}
