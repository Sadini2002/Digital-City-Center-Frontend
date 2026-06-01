import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import ForgotPassword from '../pages/ForgotPassword'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import NotFoundPage from '../pages/NotFoundPage'
import PlaceholderPage from '../pages/PlaceholderPage'
import CategoryPage from '../pages/CategoryPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import Register from '../pages/Register'
import SearchResultsPage from '../pages/SearchResultsPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact" description="Support contacts and inquiry form." />} />
          <Route path="/shops" element={<PlaceholderPage title="Shops" description="Browse all marketplace shops." />} />
          <Route path="/deals" element={<PlaceholderPage title="Deals" description="Flash deals and limited-time offers." />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/shop/:shopname" element={<PlaceholderPage title="Shop Page" description="Seller storefront with all listings." />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/register/seller" element={<PlaceholderPage title="Seller Registration" description="Seller onboarding flow." />} />
          <Route path="/account" element={<PlaceholderPage title="Buyer Account" description="Profile, addresses, and order history." />} />
          <Route path="/cart" element={<PlaceholderPage title="Cart" description="Items from multiple sellers with quantity controls." />} />
          <Route path="/checkout" element={<PlaceholderPage title="Checkout" description="Address, delivery option, and payment selection." />} />
          <Route path="/order/:id/success" element={<PlaceholderPage title="Order Success" description="Order confirmation after checkout." />} />
          <Route path="/order/:id" element={<PlaceholderPage title="Order Tracking" description="Status timeline for a specific order." />} />
          <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" description="Saved products for later purchase." />} />
          <Route path="/seller/dashboard" element={<PlaceholderPage title="Seller Dashboard" description="Seller summary with orders, earnings, and listings." />} />
          <Route path="/seller/listings" element={<PlaceholderPage title="Seller Listings" description="Manage all seller listings." />} />
          <Route path="/seller/listings/new" element={<PlaceholderPage title="Add or Edit Listing" description="Create or update seller listing details." />} />
          <Route path="/seller/orders" element={<PlaceholderPage title="Seller Orders" description="Order queue with status updates." />} />
          <Route path="/seller/earnings" element={<PlaceholderPage title="Seller Earnings" description="Revenue and payout history." />} />
          <Route path="/seller/settings" element={<PlaceholderPage title="Seller Shop Settings" description="Shop profile and operating details." />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<PlaceholderPage title="Admin Dashboard" description="Platform-wide KPIs and summaries." />} />
          <Route path="/admin/sellers" element={<PlaceholderPage title="Admin Seller Management" description="Approve, reject, or suspend sellers." />} />
          <Route path="/admin/categories" element={<PlaceholderPage title="Admin Category Management" description="Add, edit, and disable marketplace categories." />} />
          <Route path="/admin/orders" element={<PlaceholderPage title="Admin Orders" description="Platform-level order and dispute handling." />} />
          <Route path="/admin/delivery" element={<PlaceholderPage title="Admin Delivery Providers" description="Manage delivery partner registrations." />} />
          <Route path="/admin/reports" element={<PlaceholderPage title="Admin Reports" description="Sales and performance reporting views." />} />
          <Route path="/admin/settings" element={<PlaceholderPage title="Admin Platform Settings" description="Commission and system configuration." />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
