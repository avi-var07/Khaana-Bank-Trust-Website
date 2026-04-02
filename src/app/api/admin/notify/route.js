import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import transporter from '@/lib/mailer';
import { generateICS } from '@/lib/ics';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function POST(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();
    const events = await readDB('events.json');
    const subscribers = await readDB('subscribers.json');
    
    const event = events.find(e => e.id === eventId);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const icsContent = await generateICS(event);
    
    let emailCount = 0;
    
    // In a real app, use a queue/worker. Here we loop for MVP.
    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: '"Khaana Bank Trust" <info@Khaanabank.org>',
          to: sub.email,
          subject: `Upcoming Event: ${event.title}`,
          text: `Hi ${sub.name},\n\nWe have an upcoming event: ${event.title}\nDate: ${event.date}\nLocation: ${event.location}\n\n${event.description}\n\nSee you there!`,
          attachments: [
            {
              filename: 'event.ics',
              content: icsContent
            }
          ]
        });
        emailCount++;
      } catch (err) {
        console.error(`Failed to send email to ${sub.email}:`, err);
      }

    }

    return NextResponse.json({ 
      message: 'Notifications sent to all subscribers', 
      emailCount,
      emailsSent: emailCount
    });
  } catch (err) {
    console.error('Notification error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
