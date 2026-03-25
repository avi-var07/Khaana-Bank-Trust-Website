import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const subs = await readDB('subscribers.json');
    return NextResponse.json(subs);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subscribers = await readDB('subscribers.json');
    
    // Check if already subscribed
    if (subscribers.find(s => s.email === email)) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    const newSubscriber = {
      id: uuidv4(),
      name,
      email,
      phone,
      subscribedAt: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    await writeDB('subscribers.json', subscribers);

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
