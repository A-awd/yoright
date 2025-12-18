# YoRight - Luxury Travel Booking Platform (OTA)

## Overview
YoRight is a production-ready luxury bilingual (Arabic/English) OTA platform for hotel booking, inspired by Siora hotel booking design. Built with NestJS + Fastify backend serving a React SPA frontend on a single port (5000) with mock mode for development.

**Default Settings:**
- Default Language: Arabic (ar)
- Default Currency: SAR (Saudi Riyal)
- Supported Languages: Arabic (RTL) and English (LTR)
- Mock Mode: Enabled by default (MOCK_MODE=1)

## Recent Changes (December 18, 2025)

### ✅ RateHawk B2B API v3 Integration Preparation (v3.2)
Complete backend preparation for RateHawk hotel supplier integration:

**Environment Configuration:**
- `RATEHAWK_API_KEY` - Your RateHawk API key (placeholder set)
- `RATEHAWK_PARTNER_ID` - Your RateHawk partner ID (placeholder set)  
- `RATEHAWK_API_URL` - API base URL (defaults to https://api.worldota.net/api/b2b/v3)

**New RateHawk API Service (`apps/gateway/src/modules/suppliers/ratehawk-api.service.ts`):**
- `searchByRegion()` - Search hotels by region/city
- `searchByHotelIds()` - Search specific hotels
- `getHotelPage()` - Get detailed hotel information with rooms
- `prebook()` - Pre-book to get final price and book hash
- `book()` - Complete booking with guest info
- `getOrderStatus()` - Check booking status
- `cancelOrder()` - Cancel a booking

**New Booking Endpoints:**
- `POST /api/bookings/prebook` - Pre-book room to get final price (RateHawk flow)
- `POST /api/bookings/confirm` - Confirm booking after prebook
- `GET /api/bookings/status` - Check if RateHawk API is configured

**Automatic Mock/Live Switching:**
- When API keys are placeholders → Uses mock data automatically
- When real API keys are set → Uses live RateHawk API
- Falls back to mock on API errors for reliability

**To Go Live with RateHawk:**
1. Get your Sandbox API key from RateHawk
2. Update `RATEHAWK_API_KEY` with your real key
3. Update `RATEHAWK_PARTNER_ID` with your partner ID
4. The system will automatically switch to live API calls

## Previous Changes (December 10, 2025)

### ✅ Critical Bug Fixes & API Integration (v3.1)
- **Fixed MyTrips token mismatch:** Changed localStorage key from 'token' to 'yoright_token' for consistency with auth system
- **Switched to BrowserRouter:** Changed from HashRouter to BrowserRouter for better SEO and clean URLs
- **Backend mock service expanded:** Added 50+ hotels across all 26 destination cities with complete data (room types, amenities, pricing)
- **API integration verified:** SearchResults, HotelDetails, Checkout, Confirmation, MyTrips, Profile all connected to real backend endpoints
- **Auth flow working:** Login/SignUp use real JWT authentication with token storage

## Previous Changes (December 8, 2025)

### ✅ Siora-Inspired Luxury Redesign (v3.0)
Complete UI overhaul with Siora hotel booking design as the base:

**Design System Updates:**
- New luxury color palette: Gold, Charcoal, Cream, Primary
- Typography: Playfair Display for headings, Inter for body, Cairo for Arabic
- Premium shadows and animations
- Generous white space and minimal aesthetic

**New UI Component Library (apps/web-client/src/components/ui/):**
- Button - Primary (gold), Secondary, Ghost variants with loading state
- Input - Floating labels, icons, error states
- Select - Custom styled dropdown
- Card - Flexible with padding variants and hover effects
- Badge - Status badges and category labels
- Avatar - User avatars with initials fallback
- Rating - Gold star ratings with review counts
- DatePicker - Check-in/Check-out date selector
- GuestSelector - Adults/Children/Rooms counter
- Modal - Dialog with backdrop blur and animations

**Redesigned Pages:**
1. **Login & SignUp** - Full-page luxury auth with split layout
2. **Home** - Hero search, popular destinations, featured hotels, special offers
3. **Search Results** - Advanced filters (price, stars, amenities, meal plans), grid/list view
4. **Hotel Details** - Image gallery, rooms, amenities, reviews, booking card
5. **Checkout** - Step progress, guest details, payment form, booking summary
6. **Confirmation** - Success animation, booking reference, next steps
7. **Profile** - Avatar, stats, settings, favorites
8. **My Trips** - Upcoming/Past/Cancelled tabs with trip cards

**Premium Hotel Card Component:**
- Large 4:3 aspect ratio image
- Favorite heart icon
- Featured/New badges
- Hotel name in display font
- Location with icon
- Tagline (e.g., "Beachfront · Adults only")
- Star rating
- Price per night (gold)
- "View Details" button

### ✅ Previous Updates (v2.1)
- Database migration to PostgreSQL with Prisma
- Payment-booking linkage with webhooks
- Google Maps integration with context provider
- React Error #310 fixed

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
- Routing: React Router (BrowserRouter)
- Build Tool: Vite
- Styling: Tailwind CSS with luxury theme
- Design: Siora-inspired luxury hotel booking UI
- UI Components: Custom component library
- State Management: React hooks + Context

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
      /components
        /ui                  # UI component library
          Button.tsx
          Input.tsx
          Select.tsx
          Card.tsx
          Badge.tsx
          Avatar.tsx
          Rating.tsx
          DatePicker.tsx
          GuestSelector.tsx
          Modal.tsx
          index.ts           # Exports all components
        /layout
          Navbar.tsx
        HotelCard.tsx       # Premium hotel card
        FilterPanel.tsx     # Search filters
        Map.tsx             # Google Maps
      /contexts
        MapsContext.tsx     # Maps provider
      /pages
        Home.tsx            # Hero + destinations + featured
        Login.tsx           # Luxury login page
        SignUp.tsx          # Luxury signup page
        SearchResults.tsx   # Search with filters
        HotelDetails.tsx    # Hotel page with rooms
        Checkout.tsx        # Booking flow
        Confirmation.tsx    # Success page
        Profile.tsx         # User account
        MyTrips.tsx         # Booking history
        Offers.tsx          # Special offers
      /services
        api.ts              # API client
      /types
        index.ts            # TypeScript types
    /dist                   # Production build

/package.json               # Workspace root
```

### React Frontend Pages

**Auth Pages (Full-page layout, no navbar):**
- **Login** (`/#/login`) - Email/password with social login
- **SignUp** (`/#/signup`) - Registration with validation

**Main Pages (With navbar and bottom navigation):**
- **Home** (`/`) - Hero search, destinations, featured hotels
- **Search** (`/#/search`) - Results with advanced filters
- **Hotel Details** (`/#/hotel/:id`) - Full hotel page
- **Checkout** (`/#/checkout`) - Booking form
- **Confirmation** (`/#/confirmation/:ref`) - Success page
- **My Trips** (`/#/my-trips`) - Booking history
- **Profile** (`/#/profile`) - User settings
- **Offers** (`/#/offers`) - Special deals

### Brand Identity

**YoRight Luxury Color Palette:**
- Gold: #d4a862 - Primary accent (buttons, prices)
- Charcoal: #3d3d3d - Text and backgrounds
- Cream: #fdfbf7 - Light backgrounds
- Primary: #9a8b76 - Muted elegance

**Typography:**
- Display: Playfair Display (headings)
- Body: Inter (content)
- Arabic: Cairo (Arabic text)

**Design Principles:**
- Clean, minimal luxury aesthetic
- Generous white space
- Premium shadows (shadow-luxury, shadow-card)
- Smooth animations (fade-in, slide-up, scale-in)
- 2xl/3xl rounded corners

### Key Features

1. **Luxury UI Components**: Complete component library with consistent styling
2. **Advanced Search Filters**: Price range, star rating, property type, amenities, meal plans
3. **Premium Hotel Cards**: Large images, badges, ratings, favorites
4. **Booking Flow**: Step-by-step with progress indicator
5. **Profile & History**: User settings, saved hotels, trip history
6. **Bilingual Support**: Arabic (RTL) and English (LTR)
7. **Responsive Design**: Mobile-first with bottom navigation
8. **Mock Mode**: Works without API keys for development

### Build & Deploy Scripts

```bash
# Development
npm run dev              # Start gateway only
npm run dev:web          # Start React dev server

# Production Build
npm run build            # Build both gateway and web client
npm run build:web        # Build React app only
npm run serve:web        # Build + start gateway serving React

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
```

### Environment Variables

```
PORT=5000                         # Server port
DATABASE_URL=postgres://...       # PostgreSQL connection
NODE_ENV=production               # Environment

# Optional (for real APIs)
MOCK_MODE=1                       # Enable mock providers
VITE_GOOGLE_MAPS_API_KEY=...     # Google Maps API key
```

### Security Notes
- NEVER commit `.env` files to version control
- Use deployment secrets for API keys
- Google Maps API key restricted to production domain

## Deployment Ready

**Current Status:** ✅ Production Ready (v3.0)

- ✅ Siora-inspired luxury UI complete
- ✅ All pages redesigned
- ✅ Component library created
- ✅ Responsive mobile design
- ✅ Mock mode working
- ✅ Database connected
- ✅ API documentation available

**To Deploy:**
1. Set environment variables
2. Run `npm run serve:web`
3. Application available at `http://0.0.0.0:5000`

---
Last Updated: December 8, 2025  
Version: 3.0.0 (Siora-Inspired Luxury Redesign)  
Status: Production-Ready with Premium UI
