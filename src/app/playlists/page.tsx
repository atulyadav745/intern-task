"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  videos: Video[];
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null); // Track the currently playing video ID

  useEffect(() => {
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
      {playlists.map((playlist) => (
        <div key={playlist.id} className="mb-8">
          <h2 className="text-xl font-semibold">{playlist.title}</h2>
          <p>{playlist.description}</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {playlist.videos.map((video) => (
              <div
                key={video.id}
                className="border p-4 cursor-pointer"
                onClick={() =>
                  setPlayingVideoId((prev) => (prev === video.id ? null : video.id))
                } // Toggle video playback
              >
                {playingVideoId === video.id ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      className="mb-2"
                      width={320}
                      height={180}
                    />
                    <h3 className="font-bold">{video.title}</h3>
                    <p>{video.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
