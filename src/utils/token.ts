import crypto from 'crypto';

const SECRET_KEY =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  'bpharm-recovery-secret-fallback-key-2026';

export function generateRecoveryToken(
  applicationNumber: string,
  expiresInMinutes: number = 15,
): string {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const payload = JSON.stringify({ applicationNumber, expiresAt });
  const base64Payload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

export function verifyRecoveryToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(base64Payload)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadStr = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload.applicationNumber;
  } catch (error) {
    return null;
  }
}
