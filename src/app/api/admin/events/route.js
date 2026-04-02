import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import transporter from '@/lib/mailer';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await readDB('events.json');
  return NextResponse.json(events);
}

export async function POST(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const events = await readDB('events.json');
    const subscribers = await readDB('subscribers.json');
    
    const newEvent = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    };
    
    events.unshift(newEvent);
    await writeDB('events.json', events);

    let emailCount = 0;
    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
          to: sub.email,
          subject: `New Event Update: ${newEvent.title}`,
          text: `Hi ${sub.name},\n\nA new update from Khaana Bank Trust:\n\nEvent: ${newEvent.title}\nDate: ${newEvent.date}\nLocation: ${newEvent.location || 'TBA'}\nType: ${newEvent.type || 'General'}\n\n${newEvent.description || ''}\n\nThank you for supporting Khaana Bank Trust.`,
        });
        emailCount++;
      } catch (err) {
        console.error(`Failed to send event email to ${sub.email}:`, err);
      }
    }

    return NextResponse.json(
      {
        event: newEvent,
        emailCount,
        message: 'Event created. Welcome email sent to subscribers.'
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();
    const events = await readDB('events.json');
    
    const filteredEvents = events.filter(e => e.id !== eventId);
    
    if (filteredEvents.length === events.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    await writeDB('events.json', filteredEvents);
    
    return NextResponse.json({
      message: 'Event deleted successfully',
      remainingEvents: filteredEvents.length
    });
  } catch (err) {
    console.error('Delete event error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
