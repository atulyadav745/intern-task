"use client";

interface Playlist {
  id: string;
  title: string;
  description: string;
}

import { useEffect, useState } from "react";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // This ensures that the window object is accessed only on the client-side
    const token = new URLSearchParams(window.location.search).get("accessToken");
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      console.error("No access token provided.");
      setLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`/api/playlists?accessToken=${accessToken}`);
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }
        const data = await response.json();
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  if (loading) {
    return <div>Loading playlists...</div>;
  }

  if (playlists.length === 0) {
    return <div>No playlists found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Your YouTube Playlists</h1>
      <ul className="mt-4">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-4">
            <h2 className="text-xl font-semibold">{playlist.title}</h2>
            <p>{playlist.description}</p>
            <a
              href={`https://www.youtube.com/playlist?list=${playlist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View on YouTube
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
