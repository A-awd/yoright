import { Hotel, Booking, CityIntelligence, HotelSearchResponse, User, AuthResponse } from '../types';

const API_BASE = '/api';

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    register: async (data: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
    }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to register');
      }
      return res.json();
    },

    login: async (data: {
      email: string;
      password: string;
    }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to login');
      }
      return res.json();
    },

    getProfile: async (): Promise<User> => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to get profile');
      return res.json();
    },

    updateProfile: async (data: {
      name?: string;
      email?: string;
      phone?: string;
    }): Promise<User> => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
  },

  hotels: {
    search: async (params: {
      cityId?: string;
      checkIn?: string;
      checkOut?: string;
      adults?: number;
    }): Promise<HotelSearchResponse> => {
      const query = new URLSearchParams();
      if (params.cityId) query.append('cityId', params.cityId);
      if (params.checkIn) query.append('checkIn', params.checkIn);
      if (params.checkOut) query.append('checkOut', params.checkOut);
      if (params.adults) query.append('adults', params.adults.toString());

      const res = await fetch(`${API_BASE}/hotels/search?${query}`);
      if (!res.ok) throw new Error('Failed to search hotels');
      return res.json();
    },

    getById: async (id: string): Promise<Hotel> => {
      const res = await fetch(`${API_BASE}/hotels/${id}`);
      if (!res.ok) throw new Error('Failed to get hotel');
      return res.json();
    },
  },

  bookings: {
    create: async (data: {
      hotelId: string;
      cityId: string;
      roomData: Record<string, any>;
      guestInfo: Record<string, any>;
      checkIn: string;
      checkOut: string;
      total: number;
      vat: number;
      currency?: string;
    }): Promise<Booking> => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      return res.json();
    },

    getMyBookings: async (): Promise<Booking[]> => {
      const res = await fetch(`${API_BASE}/bookings/my`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to get bookings');
      return res.json();
    },

    getByReference: async (reference: string): Promise<Booking> => {
      const res = await fetch(`${API_BASE}/bookings/${reference}`);
      if (!res.ok) throw new Error('Failed to get booking');
      return res.json();
    },
  },

  payments: {
    createIntent: async (data: {
      bookingId: string;
      method: string;
      amount: number;
      currency: string;
    }): Promise<{ clientSecret: string; paymentId: string }> => {
      const res = await fetch(`${API_BASE}/payments/intent`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create payment intent');
      return res.json();
    },

    getStatus: async (id: string): Promise<any> => {
      const res = await fetch(`${API_BASE}/payments/${id}`);
      if (!res.ok) throw new Error('Failed to get payment status');
      return res.json();
    },
  },

  fx: {
    getLatest: async (): Promise<{ base: string; rates: Record<string, number> }> => {
      const res = await fetch(`${API_BASE}/fx/latest`);
      if (!res.ok) throw new Error('Failed to get exchange rates');
      return res.json();
    },
  },

  cityIntel: {
    get: async (cityId: string, month?: string): Promise<CityIntelligence> => {
      const query = month ? `?month=${month}` : '';
      const res = await fetch(`${API_BASE}/cityintel/${cityId}${query}`);
      if (!res.ok) throw new Error('Failed to get city intelligence');
      return res.json();
    },
  },
};
