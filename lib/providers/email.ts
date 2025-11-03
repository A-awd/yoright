import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface BookingEmailData {
  to: string;
  bookingReference: string;
  guestName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  total: string;
  currency: string;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>YoRight</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Dear ${data.guestName},</h2>
            <p>Thank you for booking with YoRight! Your reservation has been confirmed.</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span>Reference Number:</span>
                <strong>${data.bookingReference}</strong>
              </div>
              <div class="detail-row">
                <span>Hotel:</span>
                <strong>${data.hotelName}</strong>
              </div>
              <div class="detail-row">
                <span>Room:</span>
                <span>${data.roomName}</span>
              </div>
              <div class="detail-row">
                <span>Check-in:</span>
                <span>${data.checkIn}</span>
              </div>
              <div class="detail-row">
                <span>Check-out:</span>
                <span>${data.checkOut}</span>
              </div>
              <div class="detail-row">
                <span>Total Amount:</span>
                <strong>${data.total} ${data.currency}</strong>
              </div>
            </div>
            
            <p>We look forward to welcoming you!</p>
          </div>
          <div class="footer">
            <p>© 2025 YoRight. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@yoright.com',
        to: data.to,
        subject: `Booking Confirmation - ${data.bookingReference}`,
        html,
      });
    } else {
      console.log('Email would be sent:', { to: data.to, subject: `Booking Confirmation - ${data.bookingReference}` });
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
