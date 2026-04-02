import crypto from 'crypto';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || 'khaanabanktrust@gmail.com';
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function getSessionPayload(token) {
  if (!token || !token.includes('.')) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  if (expected !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.email || !payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(email) {
  const payload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token) {
  return !!getSessionPayload(token);
}

export function getSessionCookieConfig() {
  return {
    name: SESSION_COOKIE,
    maxAge: SESSION_MAX_AGE_SECONDS,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  };
}

export function isAdminAuthenticated(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function getAuthenticatedAdminEmail(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = getSessionPayload(token);
  return payload?.email || null;
}
