# Delivery module — local dev + backend guide

Same pattern as **buyer** (`orderStorage.js`) and **seller** (reads buyer storage):  
**pages → `utils/deliveryStorage.js` → localStorage**

## Local dev (no backend)

- All delivery portal pages import from `utils/deliveryStorage.js`
- Demo login: `/login?portal=delivery`
- Data keys: `dcc_delivery_jobs`, `dcc_delivery_drivers`, `dcc_delivery_notifications`

## Buyer tracking (unchanged buyer components)

- `OrderLiveTrackingBlock` still uses `trackingApi` / hooks
- `trackingApi.js` reads the same `deliveryStorage` mocks

## When backend is ready

Wire PDF `/api/v1` routes in a new service layer and replace storage calls in pages — same approach as wiring `paymentService.js` for buyer checkout.

### PDF endpoints (reference)

| Area | Routes |
|------|--------|
| Provider | `POST/GET/PUT /delivery-providers/*` |
| Jobs | `GET /delivery-providers/jobs`, `GET /deliveries/assigned`, `POST /deliveries/assign` |
| Status | `PUT /deliveries/:id/status`, `GET /deliveries/status`, `GET /deliveries/history` |
| Tracking | `GET/PUT /deliveries/:id/tracking`, `GET /orders/:id/tracking` |
| Notifications | `GET /delivery/notifications`, `PUT /delivery/notifications/:id/read` |

Set `VITE_API_BASE_URL=http://localhost:5000/api/v1` in `.env` when integrating.

## Files

- `utils/deliveryStorage.js` — mock data + CRUD (use this in pages)
- `services/trackingApi.js` — thin async wrapper for buyer hooks
- `services/deliveryApi.js` — legacy async aliases (optional)
- `services/adminDeliveryApi.js` — admin routes (real HTTP)
