# YoRight Architecture

## System Overview

YoRight is a production-grade travel booking platform built with:

- **Backend**: NestJS + Fastify (apps/gateway)
- **Frontend**: Static HTML/CSS/JS (apps/web)
- **Database**: PostgreSQL via Prisma (with in-memory fallback)
- **API**: RESTful with OpenAPI 3.1 specification

## Architecture Patterns

### Clean Architecture

```
Controllers → Services → Adapters → External APIs
     ↓           ↓
   DTOs      Business Logic
```

### Module Structure

Each feature module follows:

```
module/
├── module.module.ts      # NestJS module definition
├── module.controller.ts  # HTTP endpoints
├── module.service.ts     # Business logic
└── dto/                  # Data transfer objects
```

### Core Modules

- **Database**: Prisma client with in-memory fallback for mock mode
- **Logger**: Structured logging with Pino
- **Flags**: Hot-reloadable feature flags

### Feature Modules

- **Health**: System health and metrics
- **Auth**: OTP-based authentication
- **Hotels**: Search and details
- **Bookings**: Reservation management
- **Payments**: Payment processing with Tap
- **FX**: Currency exchange rates
- **CityIntel**: City data and insights
- **Admin**: Administrative operations

## Data Flow

### Hotel Search

1. User submits search (city, dates, guests)
2. Controller validates params
3. Service calls supplier adapter
4. Mock or real provider returns results
5. Response includes hotels with pricing in SAR

### Booking Flow

1. User selects room and enters guest info
2. POST /api/bookings creates pending booking
3. VAT calculated (15%)
4. Reference number generated (YR-XXXXX-XXXXX)
5. Payment intent created
6. Webhook updates booking status

## Security

- Request ID correlation
- PII/PAN sanitization in logs
- Rate limiting on sensitive endpoints
- CORS configuration
- Webhook signature verification
- Idempotency keys for payments

## Scalability

- Stateless design (except in-memory mock mode)
- Database connection pooling
- FX rate caching (2h TTL)
- City intel caching
- Horizontal scaling ready

## Resilience

- Timeout handling
- Circuit breakers (planned)
- Graceful degradation
- Health checks
- Error boundaries

## Observability

- Structured logs (JSON)
- Request correlation IDs
- Metrics endpoint
- Health check endpoint
- Admin dashboard

## Mock Mode

When `MOCK_MODE=1`:

- Uses in-memory data stores
- Mock suppliers (RateHawk, Tap)
- Auto-complete payment flows
- No external API dependencies
- Perfect for demos and development
