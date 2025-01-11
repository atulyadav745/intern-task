import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "@/lib/mongodb";
import { Playlist } from "@/models/Playlist";

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    resourceId: { videoId: string };
  };
}

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

interface YouTubePlaylistVideosResponse {
  items: YouTubeVideoItem[];
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
    const playlistsResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!playlistsResponse.ok) {
      throw new Error("Failed to fetch playlists from YouTube API");
    }

    const playlistsData: YouTubePlaylistsResponse = await playlistsResponse.json();

    const playlists = [];
    for (const playlist of playlistsData.items) {
      const playlistId = playlist.id;

      // Fetch videos for the playlist
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!videosResponse.ok) {
        throw new Error("Failed to fetch videos from YouTube API");
      }

      const videosData: YouTubePlaylistVideosResponse =
        await videosResponse.json();

      const videos = videosData.items.map((video) => ({
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
      }));

      playlists.push({
        id: playlistId,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        videos,
      });
    }

    res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}
