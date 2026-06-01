import { IMG } from '../../config/images'

export const defaultProduct = {
  id: 'ultra-smart-watch-pro-10',
  title: 'Ultra-Smart Watch Pro Series 10 – Titanium Silver Edition',
  breadcrumbs: [
    { label: 'Home', to: '/' },
    { label: 'Electronics', to: '/category/electronics' },
    { label: 'Wearables', to: '/category/wearables' },
    { label: 'Ultra-Smart Watch Pro Series 10', to: null },
  ],
  images: [
    IMG.products.smartwatch,
    IMG.products.smartwatchSilver,
    IMG.products.smartwatchBlack,
  ],
  badges: [
    { label: 'SALE -20%', className: 'bg-red-500' },
    { label: 'HOT', className: 'bg-dcc-primary' },
  ],
  rating: 4.8,
  reviewCount: 128,
  seller: {
    name: 'Tech World LK',
    verified: true,
    feedback: '98% Positive Feedback',
    shopSlug: 'tech-world-lk',
  },
  price: 45990,
  originalPrice: 57500,
  stock: 12,
  colors: [
    { id: 'black', name: 'Midnight Black', swatch: '#1f2937' },
    { id: 'silver', name: 'Titanium Silver', swatch: '#d1d5db' },
    { id: 'gold', name: 'Champagne Gold', swatch: '#d4af37' },
  ],
  defaultColorId: 'silver',
  sizes: ['45mm', '41mm'],
  defaultSize: '45mm',
  description:
    'Experience the next generation of wearable technology with the Ultra-Smart Watch Pro Series 10. Engineered with a premium titanium finish, advanced health sensors, and seamless connectivity for your daily life in Sri Lanka and beyond.',
  featureCards: [
    {
      title: 'Health Tracking',
      description: 'Heart rate, SpO2, sleep stages, and stress monitoring around the clock.',
      icon: 'heart',
    },
    {
      title: 'Battery Life',
      description: 'Up to 18 hours of mixed use with fast magnetic charging.',
      icon: 'battery',
    },
  ],
  highlights: [
    'Always-On Retina OLED display with 2000 nits peak brightness',
    'IP68 water & dust resistance for active lifestyles',
    'S8 SiP dual-core processor with on-device Siri',
    'Crash detection and emergency SOS built in',
  ],
  specifications: [
    { label: 'Display', value: '1.9" Always-On Retina OLED' },
    { label: 'Case', value: 'Titanium, 45mm' },
    { label: 'Connectivity', value: 'Bluetooth 5.3, Wi-Fi, GPS' },
    { label: 'Sensors', value: 'HR, ECG, SpO2, accelerometer, gyro' },
    { label: 'Battery', value: 'Up to 18 hours' },
    { label: 'Compatibility', value: 'iOS 17+, Android 12+' },
  ],
  reviews: [
    {
      id: '1',
      author: 'Amara M.',
      initials: 'AM',
      rating: 5,
      date: '2 days ago',
      body: 'Absolutely love this watch! The battery lasts longer than advertised and the health tracking is incredibly accurate. Delivery was super fast to Colombo.',
    },
    {
      id: '2',
      author: 'Nimal P.',
      initials: 'NP',
      rating: 5,
      date: '1 week ago',
      body: 'Great build quality and the titanium finish looks premium. Seller was responsive and packaging was secure.',
    },
  ],
  relatedProducts: [
    {
      id: 'sunglasses',
      title: 'Polarized Aviator Sunglasses',
      price: 12500,
      rating: 4.6,
      image: IMG.products.sunglasses,
    },
    {
      id: 'headphones',
      title: 'Noise-Canceling Headphones',
      price: 28990,
      rating: 4.9,
      image: IMG.products.headphones,
    },
  ],
}

export function formatLkr(amount) {
  return `LKR ${amount.toLocaleString('en-LK')}`
}
