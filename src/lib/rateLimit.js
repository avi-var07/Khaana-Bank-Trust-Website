import { readDB, writeDB } from '@/lib/db';

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp || 'unknown-ip';
}

// Next.js route-handler equivalent to express-rate-limit.
export async function enforceRateLimit(request, {
  key,
  limit,
  windowMs,
}) {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucketKey = `${key}::${ip}`;

  const rows = await readDB('api-rate-limits.json');
  let row = rows.find((r) => r.key === bucketKey);

  if (!row) {
    row = {
      key: bucketKey,
      count: 0,
      windowStart: now,
    };
    rows.push(row);
  }

  if (now - row.windowStart >= windowMs) {
    row.count = 0;
    row.windowStart = now;
  }

  row.count += 1;
  await writeDB('api-rate-limits.json', rows);

  if (row.count > limit) {
    const retryAfterSec = Math.ceil((windowMs - (now - row.windowStart)) / 1000);
    return {
      blocked: true,
      retryAfterSec,
    };
  }

  return {
    blocked: false,
    retryAfterSec: 0,
  };
}
