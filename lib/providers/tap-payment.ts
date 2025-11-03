import axios from 'axios';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: Record<string, any>
): Promise<PaymentIntent> {
  try {
    if (!process.env.TAP_SECRET_KEY) {
      return {
        id: `mock_intent_${Date.now()}`,
        amount,
        currency,
        status: 'pending',
        clientSecret: 'mock_secret',
      };
    }

    const response = await axios.post(
      'https://api.tap.company/v2/charges',
      {
        amount,
        currency: currency.toUpperCase(),
        customer_initiated: true,
        threeDSecure: true,
        save_card: false,
        description: `YoRight Booking ${metadata.bookingReference}`,
        metadata,
        redirect: {
          url: `${process.env.NEXTAUTH_URL}/api/payments/tap/callback`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      amount: response.data.amount,
      currency: response.data.currency,
      status: response.data.status,
      clientSecret: response.data.transaction?.url,
    };
  } catch (error) {
    console.error('Tap payment error:', error);
    throw new Error('Failed to create payment intent');
  }
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  return true;
}
