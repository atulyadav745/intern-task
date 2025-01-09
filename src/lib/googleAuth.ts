import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,     // Add in .env.local
  process.env.GOOGLE_CLIENT_SECRET, // Add in .env.local
  "https://tapti-intern.vercel.app/api/auth/callback" // Adjust the redirect URI
);

export const getAuthUrl = (): string => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  });
};
