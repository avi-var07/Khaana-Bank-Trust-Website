import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

function legacySha256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Always use bcrypt for new password hashes.
export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

// Backward-compatible verification: supports bcrypt and old sha256 hashes.
export async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;

  const isBcrypt = storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$');
  if (isBcrypt) {
    return bcrypt.compare(password, storedHash);
  }

  return legacySha256(password) === storedHash;
}

export function sha256HashForLegacy(password) {
  return legacySha256(password);
}
