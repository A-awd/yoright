import { prisma } from '../db';

export interface CityIntelligence {
  weather: {
    avgTemp: number;
    avgRain: number;
    avgHumidity: number;
  };
  holidays: Array<{
    name: string;
    date: string;
    type: string;
  }>;
  costOfLiving: {
    index: number;
    category: 'low' | 'medium' | 'high' | 'very-high';
  };
  flights: {
    dailyCount: number;
  };
}

const MOCK_DATA: Record<string, CityIntelligence> = {
  riyadh: {
    weather: { avgTemp: 28, avgRain: 5, avgHumidity: 25 },
    holidays: [
      { name: 'Saudi National Day', date: '2025-09-23', type: 'national' },
      { name: 'Eid al-Fitr', date: '2025-04-10', type: 'religious' },
    ],
    costOfLiving: { index: 65, category: 'medium' },
    flights: { dailyCount: 250 },
  },
  dubai: {
    weather: { avgTemp: 30, avgRain: 3, avgHumidity: 60 },
    holidays: [
      { name: 'UAE National Day', date: '2025-12-02', type: 'national' },
    ],
    costOfLiving: { index: 75, category: 'high' },
    flights: { dailyCount: 400 },
  },
};

export async function getCityIntelligence(
  cityId: string,
  month: number
): Promise<CityIntelligence> {
  try {
    const cache = await prisma.cityIntelligenceCache.findUnique({
      where: {
        cityId_month: { cityId, month },
      },
    });

    if (cache && isRecent(cache.refreshedAt)) {
      return {
        weather: cache.weatherJson as any,
        holidays: cache.holidaysJson as any,
        costOfLiving: cache.colIndexJson as any,
        flights: cache.flightsJson as any,
      };
    }

    const intel = await fetchCityIntelligence(cityId, month);

    await prisma.cityIntelligenceCache.upsert({
      where: {
        cityId_month: { cityId, month },
      },
      update: {
        weatherJson: intel.weather,
        holidaysJson: intel.holidays,
        colIndexJson: intel.costOfLiving,
        flightsJson: intel.flights,
        refreshedAt: new Date(),
      },
      create: {
        cityId,
        month,
        weatherJson: intel.weather,
        holidaysJson: intel.holidays,
        colIndexJson: intel.costOfLiving,
        flightsJson: intel.flights,
        refreshedAt: new Date(),
      },
    });

    return intel;
  } catch (error) {
    console.error('Error fetching city intelligence:', error);
    return getMockIntelligence(cityId);
  }
}

function isRecent(date: Date): boolean {
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - date.getTime() < dayInMs;
}

async function fetchCityIntelligence(cityId: string, month: number): Promise<CityIntelligence> {
  return getMockIntelligence(cityId);
}

function getMockIntelligence(cityId: string): CityIntelligence {
  const cityKey = cityId.toLowerCase();
  return MOCK_DATA[cityKey] || MOCK_DATA.riyadh;
}
