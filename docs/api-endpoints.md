# Digital City Center API Reference (Team E)

Base URL: `{{baseUrl}}` (default `http://localhost:5000/api`)

This document is a frontend-facing API contract starter for Phase 1 page development.

## 1) System

### Health Check

- **Method:** `GET`
- **Path:** `/health`
- **Auth:** Not required

```json
{
  "success": true,
  "message": "Service is healthy"
}
```

## 2) Authentication

### Buyer Register

- **Method:** `POST`
- **Path:** `/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass@123",
  "phone": "+94771234567"
}
```

### Seller Register

- **Method:** `POST`
- **Path:** `/auth/register/seller`

```json
{
  "businessName": "City Fashion House",
  "businessType": "Fashion",
  "registrationNumber": "BR-123456",
  "email": "seller@example.com",
  "phone": "+94770000000",
  "password": "StrongPass@123"
}
```

### Login

- **Method:** `POST`
- **Path:** `/auth/login`

```json
{
  "email": "jane@example.com",
  "password": "StrongPass@123"
}
```

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "usr_123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "buyer"
    }
  }
}
```

## 3) Users and Shops

### Current User Profile

- **Method:** `GET`
- **Path:** `/users/me`
- **Auth:** `Bearer token`

### Shop Details

- **Method:** `GET`
- **Path:** `/shops/:shopname`
- **Auth:** Not required

## 4) Listings and Categories

### Categories

- **Method:** `GET`
- **Path:** `/categories`
- **Auth:** Not required

### Listings (Search/Browse)

- **Method:** `GET`
- **Path:** `/listings`
- **Query:** `q`, `category`, `minPrice`, `maxPrice`, `location`, `rating`, `sort`, `page`, `limit`

### Listing Details

- **Method:** `GET`
- **Path:** `/listings/:id`

## 5) Cart and Orders

### Add to Cart

- **Method:** `POST`
- **Path:** `/cart/items`
- **Auth:** `Bearer token`

```json
{
  "listingId": "lst_001",
  "quantity": 2,
  "variant": {
    "size": "M",
    "color": "Blue"
  }
}
```

### Get Cart

- **Method:** `GET`
- **Path:** `/cart`
- **Auth:** `Bearer token`

### Checkout

- **Method:** `POST`
- **Path:** `/checkout`
- **Auth:** `Bearer token`

### Order Details

- **Method:** `GET`
- **Path:** `/orders/:id`
- **Auth:** `Bearer token`

## 6) Seller Dashboard (Phase 1)

- `GET /seller/dashboard`
- `GET /seller/listings`
- `POST /seller/listings`
- `PUT /seller/listings/:id`
- `GET /seller/orders`
- `PATCH /seller/orders/:id/status`
- `GET /seller/earnings`
- `PUT /seller/settings`

## 7) Admin Dashboard (Phase 1)

- `GET /admin/dashboard`
- `GET /admin/sellers`
- `PATCH /admin/sellers/:id/status`
- `GET /admin/categories`
- `POST /admin/categories`
- `GET /admin/orders`
- `GET /admin/reports`
- `PUT /admin/settings`

## Common Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```
