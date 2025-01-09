// import type { NextApiRequest, NextApiResponse } from 'next';
// import { oauth2Client } from '@/lib/googleAuth';
// import { connectToMongoDB } from '@/lib/mongodb';
// import { AccessToken } from '@/models/AccessToken';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: 'Missing code parameter' });
//   }

//   try {
//     const { tokens } = await oauth2Client.getToken(code as string);
//     oauth2Client.setCredentials(tokens);

//     await connectToMongoDB();

//     // Save or update the access token in MongoDB
//     await AccessToken.findOneAndUpdate(
//       { userId: 'testUser' }, // Replace with actual user ID if needed
//       {
//         userId: 'testUser',
//         accessToken: tokens.access_token,
//         refreshToken: tokens.refresh_token,
//         expiresIn: tokens.expiry_date,
//       },
//       { upsert: true }
//     );

//     res.redirect(`/playlists?accessToken=${tokens.access_token}`);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to authenticate' });
//   }
// }
import type { NextApiRequest, NextApiResponse } from "next";
import { oauth2Client } from "@/lib/googleAuth";
import { connectToMongoDB } from "@/lib/mongodb";
import { AccessToken } from "@/models/AccessToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    await connectToMongoDB();

    // Save or update the access token in MongoDB
    const userId = "testUser"; // Replace with actual user ID (e.g., from Google profile data if needed)

    await AccessToken.findOneAndUpdate(
      { userId }, // Find by userId
      {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expiry_date,
      },
      { upsert: true } // Insert if the user doesn't exist
    );

    // Redirect to the playlists page
    res.redirect(`/playlists?accessToken=${tokens.access_token}`);
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
}
