/** Seller module — registration, portal, components, API */

export { default as SellerRegisterPage } from './pages/RegisterPage'
export { default as SellerRegisterSuccessPage } from './pages/RegisterSuccessPage'

export { default as SellerDashboard } from './pages/SellerDashboard'
export { default as SellerProductsPage } from './pages/Product'
export { default as SellerAddProductPage } from './pages/AddProduct'
export { default as SellerEditProductPage } from './pages/EditProduct'
export { default as SellerOrdersPage } from './pages/Orders'
export { default as SellerShopSettingsPage } from './pages/ShopSettings'
export { default as SellerEarningsPage } from './pages/Earnings'
export { default as SellerProfilePage } from './pages/Profile'

export { default as SellerLayout } from './components/SellerLayout'
export { default as SellerRoute } from './components/SellerRoute'
export { default as DashboardCard } from './components/DashboardCard'
export { default as NotificationCard } from './components/NotificationCard'
export { default as OrderTable } from './components/OrderTable'
export { default as ProductTable } from './components/ProductTable'
export { default as SellerNavbar } from './components/SellerNavbar'
export { default as SellerSidebar } from './components/SellerSidebar'

export * from './services/sellerApi'
