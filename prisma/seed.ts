import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yoright.com' },
    update: {},
    create: {
      email: 'admin@yoright.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      locale: 'ar',
      currency: 'SAR',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  const cities = [
    { nameAr: 'الرياض', nameEn: 'Riyadh', countryCode: 'SA', centerLat: 24.7136, centerLng: 46.6753, slug: 'riyadh' },
    { nameAr: 'دبي', nameEn: 'Dubai', countryCode: 'AE', centerLat: 25.2048, centerLng: 55.2708, slug: 'dubai' },
    { nameAr: 'جدة', nameEn: 'Jeddah', countryCode: 'SA', centerLat: 21.4858, centerLng: 39.1925, slug: 'jeddah' },
    { nameAr: 'لندن', nameEn: 'London', countryCode: 'GB', centerLat: 51.5074, centerLng: -0.1278, slug: 'london' },
    { nameAr: 'باريس', nameEn: 'Paris', countryCode: 'FR', centerLat: 48.8566, centerLng: 2.3522, slug: 'paris' },
    { nameAr: 'بانكوك', nameEn: 'Bangkok', countryCode: 'TH', centerLat: 13.7563, centerLng: 100.5018, slug: 'bangkok' },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });
  }
  console.log('✅ Cities created');

  const fxRates = [
    { base: 'SAR', quote: 'USD', rate: 0.27 },
    { base: 'SAR', quote: 'EUR', rate: 0.24 },
    { base: 'USD', quote: 'SAR', rate: 3.75 },
    { base: 'USD', quote: 'EUR', rate: 0.92 },
    { base: 'EUR', quote: 'SAR', rate: 4.16 },
    { base: 'EUR', quote: 'USD', rate: 1.09 },
  ];

  for (const rateData of fxRates) {
    await prisma.fxRate.upsert({
      where: {
        base_quote: { base: rateData.base, quote: rateData.quote },
      },
      update: { rate: rateData.rate, asOf: new Date() },
      create: { ...rateData, asOf: new Date() },
    });
  }
  console.log('✅ FX rates created');

  await prisma.supplierCredential.upsert({
    where: { name: 'RATEHAWK' },
    update: {},
    create: {
      name: 'RATEHAWK',
      apiKey: process.env.RATEHAWK_API_KEY || 'sandbox_key',
      sandbox: true,
      metaJson: { apiUrl: process.env.RATEHAWK_API_URL || 'https://api.sandbox.ratehawk.com' },
    },
  });
  console.log('✅ Supplier credentials created');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
