import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "@/lib/mongodb";
import { Playlist } from "@/models/Playlist";

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
}

interface YouTubePlaylistsResponse {
  items: YouTubePlaylistItem[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Fetch playlists from the YouTube API
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlists from YouTube API");
    }

    const data: YouTubePlaylistsResponse = await response.json();

    // Save playlists to the database
    const userId = "testUser"; // Replace with dynamic user ID if needed
    for (const item of data.items) {
      const playlistId = item.id;
      const title = item.snippet.title;
      const description = item.snippet.description;

      // Save or update the playlist in the database
      await Playlist.findOneAndUpdate(
        { playlistId },
        { userId, playlistId, title, description },
        { upsert: true } // Insert if it doesn't exist
      );
    }

    // Return the playlists in the response
    const playlists = data.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
    }));

    res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}
