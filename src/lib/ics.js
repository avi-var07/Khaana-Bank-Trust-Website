import { createEvent } from 'ics';

export function generateICS(eventData) {
  const { title, date, description, location } = eventData;
  const d = new Date(date);
  
  const event = {
    start: [d.getFullYear(), d.getMonth() + 1, d.getDate(), 10, 0], // Default 10 AM
    duration: { hours: 2, minutes: 0 },
    title,
    description,
    location,
    url: 'https://Khaanabank.org',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  };

  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });
}
