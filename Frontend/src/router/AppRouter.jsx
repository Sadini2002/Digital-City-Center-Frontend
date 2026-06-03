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
import {
  SellerRegisterPage,
  SellerRegisterSuccessPage,
  SellerDashboard,
  SellerProductsPage,
  SellerAddProductPage,
  SellerOrdersPage,
  SellerShopSettingsPage,
  SellerEarningsPage,
  SellerLayout,
  SellerRoute,
} from '../seller'

import {
  AdminLoginPage,
  AdminRoute,
  AdminLayout,
  AdminDashboardPage,
  SellerManagementPage,
  CategoryManagementPage,
  OrderManagementPage,
  AdminOrderDetailsPage,
  DeliveryProvidersPage,
  AnnouncementsPage,
  CommissionSettingsPage,
  ReportsPage,
} from '../admin'


// Buyer: ../buyer · Seller: ../seller · Public/marketplace: ../pages

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="sellers" element={<SellerManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="delivery" element={<DeliveryProvidersPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="commission" element={<CommissionSettingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<CommissionSettingsPage />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/register/seller" element={<SellerRegisterPage />} />
        <Route path="/register/seller/success" element={<SellerRegisterSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/payment/gateway/:orderId" element={<PaymentGatewayPage />} />
        <Route
          path="/seller"
          element={
            <SellerRoute>
              <SellerLayout />
            </SellerRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="listings" element={<SellerProductsPage />} />
          <Route path="listings/new" element={<SellerAddProductPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="earnings" element={<SellerEarningsPage />} />
          <Route path="settings" element={<SellerShopSettingsPage />} />
        </Route>
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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
