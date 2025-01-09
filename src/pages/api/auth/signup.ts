import type { NextApiRequest, NextApiResponse } from "next";
import { oauth2Client } from "@/lib/googleAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate the URL for Google's OAuth 2.0 consent screen
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Request offline access to get refresh tokens
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly", // Scope for accessing YouTube playlists
    ],
  });

  // Redirect the user to the Google OAuth consent screen
  res.redirect(authUrl);
}
