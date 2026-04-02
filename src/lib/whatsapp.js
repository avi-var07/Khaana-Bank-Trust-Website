export function normalizePhone(phone) {
  if (!phone) return '';

  const cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned.slice(1);

  // Default to India country code for 10-digit numbers.
  if (/^\d{10}$/.test(cleaned)) return `91${cleaned}`;
  if (/^91\d{10}$/.test(cleaned)) return cleaned;

  return cleaned.replace(/^\+/, '');
}

export function createWhatsAppLink(phone, body) {
  const number = normalizePhone(phone);
  const text = encodeURIComponent(body || '');
  return `https://wa.me/${number}?text=${text}`;
}

export function createWhatsAppBroadcastLinks(subscribers, body) {
  if (!Array.isArray(subscribers)) return [];
  return subscribers
    .filter((sub) => sub?.phone)
    .map((sub) => ({
      name: sub.name,
      phone: sub.phone,
      link: createWhatsAppLink(sub.phone, body),
    }));
}

// Free WhatsApp automation is not available via official API.
// This function keeps route compatibility and reports that manual share is required.
export async function sendWhatsAppMessage() {
  return { sent: false, skipped: true, reason: 'manual-share-required' };
}
