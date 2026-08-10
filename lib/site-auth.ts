const encoder = new TextEncoder();

export const SITE_SESSION_COOKIE = "nashd_site_session";
export const SITE_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export function isSiteGateEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD);
}

export function isSiteGateConfigured(): boolean {
  return Boolean(process.env.SITE_PASSWORD && process.env.SITE_SESSION_SECRET);
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const password = process.env.SITE_PASSWORD;
  if (!password) return false;

  const [candidateDigest, passwordDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(password))
  ]);

  return constantTimeEqual(
    toBase64Url(new Uint8Array(candidateDigest)),
    toBase64Url(new Uint8Array(passwordDigest))
  );
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.SITE_SESSION_SECRET;
  if (!secret) throw new Error("SITE_SESSION_SECRET is not configured");

  const expiresAt = Math.floor(Date.now() / 1000) + SITE_SESSION_MAX_AGE;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function isValidSessionToken(token?: string): Promise<boolean> {
  const secret = process.env.SITE_SESSION_SECRET;
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAt, nonce, signature] = parts;
  const expiry = Number(expiresAt);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false;

  const expectedSignature = await hmac(`${expiresAt}.${nonce}`, secret);
  return constantTimeEqual(signature, expectedSignature);
}
