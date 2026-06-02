import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import ForgotPassword from '../pages/ForgotPassword'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import NotFoundPage from '../pages/NotFoundPage'
import PlaceholderPage from '../pages/PlaceholderPage'
import CategoryPage from '../pages/CategoryPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import Register from '../pages/Register'
import SearchResultsPage from '../pages/SearchResultsPage'
import ShopPage from '../pages/ShopPage'
import ShopsPage from '../pages/ShopsPage'

import {
  AccountPage,
  CartPage,
  CheckoutPage,
  OrderFailedPage,
  OrderReviewsPage,
  OrderSuccessPage,
  OrderTrackingPage,
  PaymentGatewayPage,
  WishlistPage,
} from '../buyer'
import { SellerRegisterPage, SellerRegisterSuccessPage } from '../seller'
import SellerDashboard from '../pages/seller/SellerDashboard'

// Buyer pages: ../buyer · Seller registration: ../seller · Public/marketplace: ../pages

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/seller" element={<SellerRegisterPage />} />
        <Route path="/register/seller/success" element={<SellerRegisterSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/payment/gateway/:orderId" element={<PaymentGatewayPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/deals" element={<PlaceholderPage title="Deals" description="Flash deals and limited-time offers." />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/shop/:shopname" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id/success" element={<OrderSuccessPage />} />
          <Route path="/order/:id/failed" element={<OrderFailedPage />} />
          <Route path="/order/:id/reviews" element={<OrderReviewsPage />} />
          <Route path="/order/:id" element={<OrderTrackingPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
         <Route path="/seller/dashboard" element={<SellerDashboard />} />
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
