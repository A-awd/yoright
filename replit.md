# YoRight - Production-Grade Travel Booking Platform (OTA)

## Overview
YoRight is a production-ready bilingual (Arabic/English) OTA (Online Travel Agency) platform for hotel search and booking. Built with NestJS + Fastify backend serving a React SPA frontend on a single port (5000) with mock mode for development without external API keys.

**Default Settings:**
- Default Language: Arabic (ar)
- Default Currency: SAR (Saudi Riyal)
- Supported Languages: Arabic (RTL) and English (LTR)
- Mock Mode: Enabled by default (MOCK_MODE=1)

## Recent Changes (November 19, 2025)

### ✅ Production Blocker Fixes (v2.1)
- **Database Migration Complete**: All bookings and payments now persist to PostgreSQL via Prisma
- **Prisma Schema Unified**: Resolved dual schema issue, using root schema as source of truth
- **Payment-Booking Linkage Fixed**: Webhook handler correctly maps payment intents to bookings
- **Type Safety**: All services use proper BookingStatus and PaymentStatus enums
- **Google Maps Integration**: Interactive maps on SearchResults and HotelDetails pages
- **React Error #310 Fixed**: Map component uses useLoadScript hook (not LoadScript wrapper)
- **Security Fix**: Removed exposed Google Maps API key from version control

### ✅ Complete Frontend Integration (v2.0)
- **React SPA Integration**: Complete React frontend integrated with NestJS gateway
- **Single-Process Deployment**: Gateway serves React build on port 5000
- **API Service Layer**: Centralized API client calling all backend endpoints
- **Arabic-First Design**: Professional RTL layout with language switcher
- **Build System**: Vite-based with production builds served by gateway
- **API Format Fix**: Resolved response format mismatch between frontend and backend

### Architecture Redesign
Migrated from Next.js SSR to NestJS + React SPA architecture:
- **Backend**: NestJS + Fastify gateway with 8 core modules
- **Frontend**: React SPA with HashRouter for client-side routing
- **Deployment**: Single process on port 5000 (production-ready)
- **Mock Providers**: RateHawk (hotels) and Tap (payments) mocks working without API keys

## Project Architecture

### Tech Stack
**Backend (apps/gateway):**
- Framework: NestJS with Fastify adapter
- Language: TypeScript
- Database: PostgreSQL with Prisma ORM
- API Documentation: OpenAPI/Swagger auto-generated
- Mock Mode: Feature flags system for development

**Frontend (apps/web-client):**
- Framework: React 18 with TypeScript
- Routing: React Router (HashRouter)
- Build Tool: Vite
- Styling: Tailwind CSS with custom brand theme
- UI: Custom components with Arabic RTL support
- State Management: React hooks

### Directory Structure
```
/apps
  /gateway                    # NestJS + Fastify backend
    /src
      /modules
        /auth                # OTP-based authentication
        /hotels              # Hotel search & details
        /bookings            # Booking management
        /payments            # Payment processing
        /fx                  # Currency exchange
        /cityintel           # City information
        /suppliers           # External API integrations
        /admin               # Admin panel API
      /shared
        /providers           # Mock providers (RateHawk, Tap)
        /database            # Prisma client
        /flags               # Feature flags system
      /main.ts              # App entry + React static serving
    /prisma
      /schema.prisma        # Database schema
    
  /web-client                 # React SPA frontend
    /src
      /components            # Reusable UI components
      /pages                 # Page components (Home, Search, etc.)
      /services              # API service layer
      /types                 # TypeScript interfaces
      /utils                 # Constants & helpers
    /dist                    # Production build (served by gateway)

/package.json                # Workspace root with scripts
```

### Gateway API Modules (8 Total)

1. **Health Module** (`/health`)
   - Health check endpoint
   - System metrics
   - Database connection status

2. **Auth Module** (`/api/auth`)
   - OTP-based authentication (send/verify)
   - Session management
   - User registration/login

3. **Hotels Module** (`/api/hotels`)
   - Search hotels by city/dates
   - Get hotel details by ID
   - Mock provider: RateHawk

4. **Bookings Module** (`/api/bookings`)
   - Create booking
   - Get booking by reference
   - List user bookings

5. **Payments Module** (`/api/payments`)
   - Create payment intent
   - Handle payment webhooks
   - Mock provider: Tap Payments

6. **FX Module** (`/api/fx`)
   - Get latest exchange rates
   - Currency conversion
   - SAR as base currency

7. **CityIntel Module** (`/api/cityintel`)
   - City information and tips
   - Tourist attractions
   - Local insights

8. **Admin Module** (`/api/admin`)
   - View all bookings
   - Feature flags management
   - Webhook logs
   - Analytics dashboard

### React Frontend Pages

- **Home** (`/`) - Hero section with search form
- **Search Results** (`/#/search`) - Hotel search results with filters
- **Hotel Details** (`/#/hotel/:id`) - Detailed hotel page
- **Checkout** (`/#/checkout`) - Booking & payment form
- **Confirmation** (`/#/confirmation`) - Booking confirmation page
- **My Trips** (`/#/my-trips`) - User booking history

### Key Features

1. **Single-Process Deployment**: Everything runs on port 5000
   - Gateway serves React build from `/apps/web-client/dist`
   - API endpoints at `/api/*`
   - Static files served with proper caching
   - SPA fallback for client-side routing

2. **Mock Mode Development**:
   - Works without external API keys
   - RateHawk mock: 50+ hotels across Saudi cities
   - Tap Payments mock: Complete payment flow simulation
   - Feature flags to toggle mock/real APIs

3. **Bilingual Support**: 
   - Arabic (RTL) and English (LTR)
   - Language switcher in navigation
   - All content translated
   - Date/currency formatting per locale

4. **API Documentation**:
   - OpenAPI spec auto-generated
   - Swagger UI at `/api-docs`
   - JSON spec at `/openapi.json`

5. **Database**: PostgreSQL with Prisma
   - Users, bookings, payments schema defined
   - Connection pooling
   - Migration system ready

### Brand Identity

**YoRight Brand Colors:**
- Primary: #0F4C5C (Dark Teal) - Trust & luxury
- Secondary: #E8B449 (Golden) - Premium & warmth
- Accent: #D4AF37 (Gold) - Elegance

**Typography:**
- Headings: System serif fonts
- Body: System UI fonts
- Arabic fonts optimized for readability

### API Response Format

All API responses follow consistent format:
```typescript
// Search results
{
  items: Hotel[],
  total: number,
  currency: string,
  params: SearchParams
}

// Single resource
{
  id: string,
  ...resourceData
}

// Error
{
  message: string,
  error: string,
  statusCode: number
}
```

### Build & Deploy Scripts

```bash
# Development
npm run dev              # Start gateway only
npm run dev:web          # Start React dev server (port 3000 with proxy)

# Production Build
npm run build            # Build both gateway and web client
npm run build:web        # Build React app only
npm run serve:web        # Build + start gateway serving React

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
```

### Environment Variables

Required for production:
```
PORT=5000                         # Server port
DATABASE_URL=postgres://...       # PostgreSQL connection (Replit provides this)
NODE_ENV=production               # Environment

# Optional (for real APIs)
MOCK_MODE=1                       # Enable mock providers
RATEHAWK_API_KEY=...             # RateHawk hotel API
TAP_SECRET_KEY=...               # Tap Payments API
VITE_GOOGLE_MAPS_API_KEY=...     # Google Maps API key (frontend)
```

**Important Security Notes:**
- NEVER commit `.env` files to version control
- Use deployment secrets for API keys
- Google Maps API key should be restricted to production domain only

### Security Implementation

- Authentication: OTP-based phone/email verification
- Authorization: Role-based access (USER, ADMIN)
- Database: User-scoped queries with Prisma
- Secrets: Environment variables (not in code)
- CORS: Configured for single-origin deployment

### Testing

**API Testing:**
```bash
# Health check
curl http://localhost:5000/health

# Search hotels
curl "http://localhost:5000/api/hotels/search?cityId=riyadh&checkIn=2025-12-01&checkOut=2025-12-03"

# API docs
open http://localhost:5000/api-docs
```

**Frontend Testing:**
- Manual testing via browser at `http://localhost:5000`
- Search flow: Home → Search → Hotel Details → Checkout
- Language switching verified
- Mobile responsive design tested

### Known Issues & Future Work

**Working ✅:**
- Single-process deployment on port 5000
- Frontend ↔ Backend integration complete
- Hotel search with mock data
- API documentation auto-generated
- Arabic RTL layout
- Build system functional
- ✅ **NEW:** Bookings persisted to PostgreSQL via Prisma
- ✅ **NEW:** Payments persisted to PostgreSQL via Prisma
- ✅ **NEW:** Payment webhook integration complete
- ✅ **NEW:** Google Maps integration on search and details pages

**Future Enhancements 📋:**
- Add Google Maps API key to deployment secrets
- Persist feature flag changes to database (currently using defaults)
- Add automated tests (Jest, Playwright)
- Real API integration (RateHawk, Tap)
- Email notifications
- Admin analytics dashboard
- Advanced search filters
- Map markers clustering for better UX

## User Preferences

- Production-grade code quality
- Mock mode by default for easy development
- Arabic-first design with RTL support
- Clean architecture with separation of concerns
- Single-process deployment for simplicity

## Deployment Ready

**Current Status:** ✅ MVP Ready for Deployment

- ✅ Frontend built and served by gateway
- ✅ All API endpoints functional
- ✅ Mock mode working without API keys
- ✅ Single port deployment (5000)
- ✅ Database connected
- ✅ OpenAPI documentation available
- ✅ No critical bugs blocking deployment

**To Deploy:**
1. Set environment variables (PORT, DATABASE_URL)
2. Run `npm run serve:web`
3. Application available at `http://0.0.0.0:5000`

---
Last Updated: November 19, 2025  
Version: 2.1.0 (Production Blockers Resolved + Database Migration Complete)  
Status: Production-Ready with Google Maps Integration
