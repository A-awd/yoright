# Data Playbook

## Data Sources

### Hotels (RateHawk)

- **Provider**: RateHawk API
- **Endpoint**: `https://api.ratehawk.com`
- **Auth**: API key in header
- **TTL**: Real-time (no caching for search)
- **License**: B2B aggregator
- **Mock**: 4 sample hotels in `ratehawk-mock.service.ts`

### Payments (Tap)

- **Provider**: Tap Payments
- **Endpoint**: `https://api.tap.company`
- **Auth**: Public/Secret keys
- **Features**: Apple Pay, mada, credit cards
- **Webhook**: Signature verification required
- **Mock**: Auto-complete payment state machine

### FX Rates

- **Provider**: External FX API (or ECB)
- **TTL**: 2 hours
- **Base**: SAR
- **Currencies**: USD, EUR, AED, GBP
- **Fallback**: Static snapshot
- **Mock**: Pre-loaded rates

### City Intelligence

- **Weather**: OpenWeather API
- **Holidays**: Calendarific API
- **Costs**: Manual curation + Numbeo
- **TTL**: 24 hours
- **Mock**: Pre-loaded for Riyadh, Jeddah, Dubai

### Google Maps

- **Provider**: Google Maps JavaScript API
- **Usage**: Marker clustering, neighborhood polygons
- **Fallback**: List view without map
- **API Key**: Required for production

## Data Storage

### PostgreSQL (Production)

- **Tables**: Users, Bookings, Payments, WebhookLogs, FeatureFlags, AuditLog
- **ORM**: Prisma
- **Migrations**: Tracked in `prisma/migrations/`

### In-Memory (Mock Mode)

- **Store**: Map<string, any> in services
- **Lifecycle**: Process lifetime
- **Use Case**: Development and demos

## Data Privacy (PDPL Compliance)

- **PII**: Phone, email, name - encrypted at rest
- **PAN**: Never stored, only tokenized
- **Logs**: Sanitized before writing
- **Retention**: 7 years for bookings (regulatory)
- **Deletion**: User right to be forgotten

## Data Integrity

- **Validation**: Zod schemas on all inputs
- **Sanitization**: HTML escaping, SQL injection prevention
- **Idempotency**: Payment operations use idempotency keys
- **Consistency**: Database transactions for multi-step operations

## Licensing & Attribution

- **Hotel Images**: Licensed from RateHawk
- **City Images**: Unsplash (free tier)
- **Icons**: Emoji (no license needed)
- **Maps**: Google Maps (paid service)

## Caching Strategy

| Data Type | TTL | Invalidation |
|-----------|-----|--------------|
| FX Rates | 2h | Manual refresh |
| City Intel | 24h | Manual refresh |
| Hotel Search | None | Real-time |
| Hotel Details | 15min | Stale-while-revalidate |

## Backup & Recovery

- **Database**: Daily backups (Neon/Supabase automatic)
- **Logs**: 30-day retention
- **Config**: Version controlled (Git)
