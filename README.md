# YoRight - Online Travel Agency Platform

A bilingual (Arabic/English) OTA web application for hotel search and booking, built with React, NestJS, TypeScript, Prisma, and PostgreSQL.

## Features

- **Bilingual Support**: Full Arabic (RTL) and English (LTR) support
- **Hotel Search & Booking**: Live hotel search with RateHawk supplier integration
- **Multi-Currency**: SAR, USD, EUR with live exchange rates
- **Payment Processing**: Tap Payments integration
- **User Authentication**: OTP and JWT-based auth
- **React SPA Frontend**: Vite + React 18 + Tailwind CSS
- **NestJS Backend**: Fastify-based API gateway with Prisma ORM

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables (see .env.example)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Initialize the database**:
```bash
npm run db:push
npm run seed
```

4. **Start the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Default Admin Credentials
- Email: `admin@yoright.com`
- Password: `admin123`

## 📁 Project Structure

```
yoright/
├── app/                          # Next.js App Router pages
│   ├── [locale]/                 # Internationalized routes
│   │   ├── page.tsx              # Home page
│   │   ├── search/hotels/        # Hotel search results
│   │   ├── hotel/[id]/           # Hotel details
│   │   ├── checkout/             # Booking checkout
│   │   ├── bookings/[reference]/ # Booking confirmation
│   │   ├── my-trips/             # User bookings
│   │   └── admin/                # Admin dashboard
│   └── api/                      # API routes
│       ├── auth/                 # NextAuth endpoints
│       ├── hotels/               # Hotel search & details
│       ├── bookings/             # Booking management
│       ├── payments/             # Payment processing
│       ├── city-intel/           # City intelligence
│       └── fx/                   # Exchange rates
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── search/                   # Search components
│   ├── hotel/                    # Hotel components
│   ├── booking/                  # Booking components
│   └── admin/                    # Admin components
├── lib/                          # Utilities and core logic
│   ├── adapters/                 # Supplier adapters
│   │   └── ratehawk.ts           # RateHawk integration
│   ├── providers/                # Service providers
│   │   ├── fx-rates.ts           # Currency exchange
│   │   ├── city-intelligence.ts  # City data
│   │   ├── email.ts              # Email service
│   │   └── tap-payment.ts        # Payment processing
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # NextAuth config
│   └── utils.ts                  # Helper functions
├── messages/                     # i18n translations
│   ├── ar.json                   # Arabic translations
│   └── en.json                   # English translations
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── public/                       # Static assets
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yoright

# Authentication
NEXTAUTH_URL=http://localhost:5000
NEXTAUTH_SECRET=your-secret-key

# Tap Payments
TAP_SECRET_KEY=sk_test_your_key
TAP_PUBLIC_KEY=pk_test_your_key

# RateHawk Supplier
RATEHAWK_API_KEY=your_api_key
RATEHAWK_API_URL=https://api.sandbox.ratehawk.com

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@yoright.com

# Optional: City Intelligence
OPENWEATHER_API_KEY=your_openweather_key
CALENDARIFIC_API_KEY=your_calendarific_key
```

### Database Schema

The application uses PostgreSQL with the following main models:
- **User**: User accounts with role-based access
- **Booking**: Hotel bookings with status tracking
- **Payment**: Payment records with Tap integration
- **City**: City information and coordinates
- **FxRate**: Currency exchange rates
- **CityIntelligenceCache**: Cached city intelligence data
- **SupplierCredential**: API credentials for suppliers

## 🏗️ Architecture

### Supplier Adapter Pattern

The application uses a pluggable adapter pattern for hotel suppliers:

```typescript
// Current: RateHawk
import { rateHawkAdapter } from '@/lib/adapters/ratehawk';

// Easy to add new suppliers:
// import { hotelbedsAdapter } from '@/lib/adapters/hotelbeds';
```

**Adding a new supplier**:
1. Create adapter file in `lib/adapters/`
2. Implement interface: `searchHotels()`, `getHotelDetails()`, `createBooking()`
3. Map supplier responses to internal DTOs
4. Update supplier selection logic in API routes

### Payment Provider Pattern

Similar adapter pattern for payment providers:

```typescript
// Current: Tap Payments
import { createPaymentIntent } from '@/lib/providers/tap-payment';

// Easy to add: Stripe, PayPal, etc.
```

### City Intelligence Providers

Modular providers for city data:
- **Weather**: OpenWeather API (with mock fallback)
- **Holidays**: Calendarific API (with static seed)
- **Cost of Living**: Static JSON seed
- **Flights**: Placeholder (ready for Aviationstack)

## 📦 API Endpoints

### Hotels
- `GET /api/hotels/search?cityId&checkIn&checkOut&guests` - Search hotels
- `GET /api/hotels/:id?checkIn&checkOut` - Hotel details with rooms

### Bookings
- `POST /api/bookings` - Create booking with payment intent
- `GET /api/bookings?reference=XXX` - Get booking details
- `GET /api/bookings` - List all bookings (admin)

### Payments
- `POST /api/payments/tap/webhook` - Tap webhook handler

### Utilities
- `GET /api/fx/latest` - Get current exchange rates
- `GET /api/city-intel?cityId&month` - Get city intelligence

## 🌍 Internationalization

The app supports Arabic (default) and English with full RTL/LTR support:

- **Translations**: `messages/ar.json` and `messages/en.json`
- **Locale routing**: `/ar/*` and `/en/*`
- **RTL/LTR**: Automatic direction switching
- **Number formatting**: Arabic-Indic numerals in Arabic, Latin in English
- **Date/Currency**: Locale-aware formatting

## 🔐 Authentication

NextAuth is configured with:
- Email/password credentials
- JWT session strategy
- Role-based access (USER, ADMIN)
- Protected routes

## 💳 Payment Integration

Tap Payments integration includes:
- Server-side payment intent creation
- Support for Apple Pay, mada, credit cards
- Webhook handling with signature verification
- Idempotent payment processing
- Automatic booking status updates

## 📧 Email Notifications

Resend integration for:
- Booking confirmations
- PDF invoice/itinerary generation
- ZATCA-compliant VAT fields

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

Test coverage focuses on:
- Supplier adapter DTOs
- Payment webhook handlers
- Currency conversion utilities

## 🚀 Deployment

The application is optimized for Replit deployment:

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Production checklist**:
- Set `NODE_ENV=production`
- Configure production database
- Set secure `NEXTAUTH_SECRET`
- Use production API keys
- Enable HTTPS
- Configure CDN for static assets

## 📝 Future Enhancements

### Phase 2: Flights Module
- Add Aviationstack integration
- Flight search and booking
- Multi-city itineraries
- Seat selection

### Phase 3: Tours & Activities
- Local experiences
- Activity booking
- Tour packages

### Phase 4: B2B Features
- Corporate rates
- Multi-user organizations
- Approval workflows
- Custom reporting

## 🤝 Contributing

This is a production-ready foundation. To extend:

1. **Add a new supplier**: Create adapter in `lib/adapters/`
2. **Add a new payment provider**: Create provider in `lib/providers/`
3. **Add a new module**: Follow the hotel module pattern
4. **Enhance UI**: Add components in `components/`
5. **Add features**: Update Prisma schema and create migrations

## 📄 License

MIT License - feel free to use this for your projects!

## 🆘 Support

For questions or issues:
- Check API logs in development console
- Review Prisma Studio: `npm run db:studio`
- Verify environment variables are set
- Check supplier API status

---

**Built with ❤️ using Next.js, TypeScript, Prisma, and Tailwind CSS**
