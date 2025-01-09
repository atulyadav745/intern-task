import type { NextApiRequest, NextApiResponse } from "next";
import { oauth2Client } from "@/lib/googleAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate the URL for Google's OAuth 2.0 consent screen
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // To get a refresh token
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly", // Scope for reading YouTube playlists
    ],
  });

  // Redirect the user to the Google OAuth consent screen
  res.redirect(authUrl);
}
