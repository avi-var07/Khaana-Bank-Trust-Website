import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';

export async function POST(request) {
  try {
    const { amount } = await request.json();

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      return NextResponse.json({ 
        error: 'Razorpay API keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.',
      }, { status: 501 });
    }

    // Razorpay expects amount in paise (multiply by 100)
    const options = {
      amount: parseInt(amount) * 100, 
      currency: "INR",
      receipt: `receipt_donate_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
