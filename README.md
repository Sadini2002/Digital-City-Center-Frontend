# Digital City Center Frontend

React frontend initialized with Vite, React Router, and Axios.

## Tech Stack

- React
- Vite
- React Router
- Axios

## Project Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env` in `Frontend`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api

# Cloudflare R2 / CDN (product & hero images)
VITE_CDN_BASE_URL=https://pub-xxxxxxxx.r2.dev/dcc-assets
```

See [docs/cloudflare-images.md](docs/cloudflare-images.md) for upload paths and setup.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview production build
- `npm run lint` - run ESLint checks

## Folder Highlights

- `src/router` - frontend routing configuration
- `src/layouts` - base layout components
- `src/pages` - starter pages
- `src/services/api` - Axios service layer
- `docs/api-endpoints.md` - API endpoint and response reference
- `postman/` - Postman collection and environment
