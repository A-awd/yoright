# YoRight - Luxury Travel Booking Platform

## Overview
YoRight is a production-ready bilingual (Arabic/English) OTA (Online Travel Agency) web application for hotel search and booking, similar to Almosafer/Trip.com. The application features a modern, luxury brand aesthetic with custom logo and color scheme.

**Default Settings:**
- Default Language: Arabic (ar)
- Default Currency: SAR (Saudi Riyal)
- Supported Languages: Arabic (RTL) and English (LTR)

## Recent Changes (November 19, 2025)

### Complete Brand Rebranding
- **Logo Implementation**: Custom YoRight logo integrated in navigation from `public/images/logo.png`
- **Brand Colors Applied**: Extracted from logo and defined in `colors.txt`
  - Primary: #0F4C5C (Dark Teal) - Main brand color from logo background
  - Primary Dark: #0A3642
  - Primary Light: #1A6F84
  - Secondary: #E8B449 (Golden Yellow) - Used for CTAs and accents
  - Accent: #D4AF37 (Gold)
- **UI Modernization**: All pages updated with consistent brand colors replacing previous purple/pink gradient design
- **Typography**: Georgia serif for headings (luxury feel), system-ui for body text

### Design System
- **Color Palette**: Defined in `tailwind.config.ts` with brand-* prefix
- **Components Updated**:
  - Navigation with logo and golden "Sign In" button
  - Search form with golden search button
  - Hero sections with dark teal background
  - All interactive elements use brand colors
  - Consistent hover states and transitions

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (email/password, session-based)
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS with custom brand configuration
- **UI Components**: Radix UI primitives
- **Payment Integration**: Tap Payments (planned)

### Directory Structure
```
/app
  /[locale]                 # Locale-based routing
    /page.tsx              # Home page with hero and search
    /search/hotels         # Hotel search results
    /hotel/[id]           # Hotel details
    /checkout             # Booking checkout
    /bookings/[reference] # Booking confirmation
    /my-trips             # User's bookings
    /auth                 # Authentication pages
  /api                    # API routes
    /hotels/search        # Hotel search endpoint
  /globals.css           # Global styles with brand colors
/components
  /LocaleShell.tsx       # Client boundary for i18n
  /Navigation.tsx        # Header with logo
  /SearchForm.tsx        # Search form component
/lib
  /auth.ts              # NextAuth configuration
  /adapters            # External API adapters
/prisma
  /schema.prisma        # Database schema
/public
  /images
    /logo.png          # YoRight brand logo
/messages              # i18n translations
  /ar.json            # Arabic translations
  /en.json            # English translations
```

### Key Features
1. **Bilingual Support**: Full RTL/LTR support with Arabic as default
2. **Authentication**: Secure user registration and login with role-based access (USER/ADMIN)
3. **Hotel Search**: Search hotels by city with date and guest filters
4. **Booking Flow**: Complete booking process with checkout and confirmation
5. **User Dashboard**: View upcoming and past trips
6. **Security**: Authentication guards, authorization checks, user-scoped queries

### Security Implementation
- All booking data access authenticated and authorized
- User-scoped database queries
- Role-based access control (USER/ADMIN)
- Session-based authentication with NextAuth
- Password hashing with bcryptjs

### Database Schema
- Users (email, password, role, name)
- Bookings (hotel details, dates, guests, status, payment info)
- Linked to user accounts with proper access control

### Styling Conventions
- Tailwind CSS with brand color utilities (brand-primary, brand-secondary, etc.)
- Custom fonts: Georgia for headings, system-ui for body
- Consistent spacing and modern UI patterns
- Responsive design for mobile, tablet, and desktop
- Dark teal hero sections for luxury aesthetic
- Golden accents for CTAs and interactive elements

### Development Workflow
- Dev server runs on port 5000 (configured in workflow)
- Hot module replacement for fast development
- TypeScript for type safety
- ESLint for code quality

### Environment Variables
- DATABASE_URL: PostgreSQL connection string (Replit database)
- SESSION_SECRET: Session encryption key
- Payment integration keys (to be added)

### Known Issues & Fixes
- ✅ React hydration warnings fixed with LocaleShell client boundary
- ✅ URL encoding issues resolved with proper Next.js router usage
- ✅ Logo aspect ratio warning fixed
- ✅ Search form validation with city dropdown

## User Preferences
- Modern, luxury aesthetic for travel booking platform
- Clean, professional design with custom branding
- Sensible defaults when not specified
- No clarifying questions - proceed with best practices

## Next Steps (Future Enhancements)
1. Integrate Tap Payments for checkout
2. Add hotel reviews and ratings
3. Implement advanced search filters (price range, amenities, ratings)
4. Add social authentication (Google, Apple)
5. Email notifications for bookings
6. Admin panel for hotel management
7. Custom fonts if provided by user

## Deployment
- Ready for Replit deployment
- Production database separate from development
- Environment variables properly configured
- Static assets in public folder

---
Last Updated: November 19, 2025
Version: 1.0.0 (Rebranded with YoRight Identity)
