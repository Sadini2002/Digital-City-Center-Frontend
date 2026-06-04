# Delivery module — backend integration (PDF contract)

Set `VITE_API_BASE_URL` (e.g. `http://localhost:5000/api/v1`).

## Delivery Provider

| Method | Path | Used by |
|--------|------|---------|
| POST | `/delivery-providers/register` | `pages/RegisterPage.jsx` |
| GET | `/delivery-providers/profile` | `deliveryApi.getProviderProfile` |
| PUT | `/delivery-providers/profile` | `deliveryApi.updateProviderProfile`, driver profile |
| GET | `/delivery-providers/jobs` | Deliveries → Available pool |

## Assignment

| Method | Path | Used by |
|--------|------|---------|
| POST | `/deliveries/assign` | Accept job |
| GET | `/deliveries/assigned` | My deliveries, dashboard |
| GET | `/deliveries/:id` | Delivery detail |

## Status

| Method | Path | Used by |
|--------|------|---------|
| PUT | `/deliveries/:id/status` | Status actions |
| GET | `/deliveries/status` | Dashboard, analytics |
| GET | `/deliveries/history` | History, earnings (derived) |

Status values: `CONFIRMED`, `PROCESSING`, `DISPATCHED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`

## Tracking

| Method | Path | Used by |
|--------|------|---------|
| GET | `/deliveries/:id/tracking` | Route tracking, live map |
| PUT | `/deliveries/:id/tracking` | Driver GPS batches |
| GET | `/orders/:id/tracking` | Buyer order tracking |
| GET | `/orders/:id/delivery-status` | Buyer delivery status |

## Notifications

| Method | Path |
|--------|------|
| GET | `/delivery/notifications` |
| PUT | `/delivery/notifications/:id/read` |

## Admin

See `services/adminDeliveryApi.js` — provider approve/reject, admin deliveries, assign.

## Mocks

`utils/deliveryStorage.js` — used when API fails (`tryApi` in service files).

## Service files

- `services/deliveryApi.js` — provider portal
- `services/trackingApi.js` — maps + buyer tracking
- `services/adminDeliveryApi.js` — admin portal (no mock fallback)
