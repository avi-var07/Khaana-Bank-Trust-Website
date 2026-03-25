import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const events = await readDB('events.json');
  return NextResponse.json(events);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const events = await readDB('events.json');
    
    const newEvent = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    };
    
    events.unshift(newEvent);
    await writeDB('events.json', events);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
