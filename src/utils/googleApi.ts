import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${process.env.BASE_URL}auth/google/callback`);