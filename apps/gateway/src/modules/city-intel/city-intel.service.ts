import { Injectable } from '@nestjs/common';

@Injectable()
export class CityIntelService {
  private cityData = {
    riyadh: {
      name: 'الرياض',
      nameEn: 'Riyadh',
      weather: {
        avgTempC: 25,
        avgHighC: 32,
        avgLowC: 18,
        rainfall: 10,
      },
      costOfLiving: {
        hotelAvg: 800,
        mealAvg: 50,
        transportAvg: 30,
      },
      flightsPerDay: 150,
      holidays: [
        { date: '2025-03-22', name: 'يوم التأسيس السعودي' },
        { date: '2025-09-23', name: 'اليوم الوطني السعودي' },
      ],
    },
    jeddah: {
      name: 'جدة',
      nameEn: 'Jeddah',
      weather: {
        avgTempC: 28,
        avgHighC: 34,
        avgLowC: 23,
        rainfall: 5,
      },
      costOfLiving: {
        hotelAvg: 750,
        mealAvg: 55,
        transportAvg: 25,
      },
      flightsPerDay: 120,
      holidays: [
        { date: '2025-03-22', name: 'يوم التأسيس السعودي' },
        { date: '2025-09-23', name: 'اليوم الوطني السعودي' },
      ],
    },
    dubai: {
      name: 'دبي',
      nameEn: 'Dubai',
      weather: {
        avgTempC: 30,
        avgHighC: 38,
        avgLowC: 25,
        rainfall: 8,
      },
      costOfLiving: {
        hotelAvg: 1200,
        mealAvg: 80,
        transportAvg: 40,
      },
      flightsPerDay: 300,
      holidays: [
        { date: '2025-12-02', name: 'اليوم الوطني الإماراتي' },
      ],
    },
  };

  async getCityIntel(cityId: string, month?: string) {
    const data = this.cityData[cityId] || this.cityData['riyadh'];
    return {
      cityId,
      ...data,
      month: month || new Date().getMonth() + 1,
      cachedAt: new Date().toISOString(),
    };
  }
}
