import { google } from "googleapis";

/**
 * Normalizes the private key from environment variables.
 * In Vercel or .env files, private keys with newlines are often escaped as "\\n".
 */
export function getFormattedPrivateKey(rawKey?: string): string | undefined {
  if (!rawKey) return undefined;
  return rawKey.replace(/\\n/g, "\n");
}

export function isGoogleConfigured(): boolean {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  return Boolean(email && key && sheetId && email.includes("@") && key.includes("BEGIN PRIVATE KEY"));
}

export function getGoogleAuthClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getFormattedPrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google Service Account credentials missing. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ];

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });

  return auth;
}
