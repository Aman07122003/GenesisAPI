# API Proxy Configuration

## Overview

The Angular development server is configured to proxy API requests to the Genesis API backend, avoiding CORS issues during local development.

## Development (localhost)

**Proxy Configuration:** `proxy.conf.json`

### How it works:
1. Angular dev server runs on `http://localhost:4200`
2. API requests to `/api/*` are forwarded to `https://genesis.eshipper.com/api/*`
3. No CORS errors because the request appears to come from the same domain

### API Endpoints:
- **Quote:** `GET /api/quotes` → `https://genesis.eshipper.com/api/quotes`
- **Shipment:** `POST /api/shipment` → `https://genesis.eshipper.com/api/shipment`

### Running the dev server:
```bash
npm start
# or
ng serve
```

The dev server automatically loads `proxy.conf.json` and forwards `/api` requests to the Genesis backend.

## Production Build

**Environment Configuration:** `src/environments/environment.prod.ts`

### How it works:
1. Production build uses `apiBaseUrl: 'https://genesis.eshipper.com/api'`
2. No proxy needed - requests go directly to the Genesis API
3. File replacement configured in `angular.json` for production builds

### Building for production:
```bash
npm run build
# or
ng build --configuration production
```

The production bundle will contain the full Genesis API URL and work correctly when deployed.

## Configuration Files

### proxy.conf.json
```json
{
  "/api": {
    "target": "https://genesis.eshipper.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": "/api"
    }
  }
}
```

### angular.json
- Development: `proxyConfig: "proxy.conf.json"` in serve > configurations > development
- Production: `fileReplacements` configured to use `environment.prod.ts`

### Services
- `src/app/quote.service.ts` - Uses `environment.apiBaseUrl`
- `src/app/shipment.service.ts` - Uses `environment.apiBaseUrl`

## Deployment Scenarios

### Same-domain deployment
If the frontend and backend are deployed to the same domain:
- No proxy needed
- Update `environment.prod.ts` to use relative paths: `"/api"`

### Different-domain deployment
If the backend is at `https://api.example.com`:
- Update `environment.prod.ts`: `"https://api.example.com/api"`
- Configure CORS on the backend API

### Using environment variables
For even more flexibility, inject configuration at runtime:
```typescript
// In main.ts or app initializer
declare global {
  interface Window {
    API_BASE_URL?: string;
  }
}

// environment.ts can read from window.API_BASE_URL
```

## Troubleshooting

### "Proxy request failed" error
- Ensure `proxy.conf.json` is in the `frontend/` root directory
- Restart the dev server after creating/modifying proxy config
- Verify Genesis API endpoint is accessible from your network

### CORS errors still appearing
- Clear browser cache
- Ensure dev server is using development configuration
- Check that `proxyConfig` is set in `angular.json`

### Production build uses wrong API URL
- Verify `src/environments/environment.prod.ts` has correct URL
- Check `angular.json` has correct `fileReplacements` configuration
- Verify production build was run (not development)
