import mongoose, { Schema, Document } from 'mongoose';

interface IPlaylist extends Document {
  userId: string;
  playlistId: string;
  title: string;
  description: string;
}

const PlaylistSchema = new Schema<IPlaylist>({
  userId: { type: String, required: true },
  playlistId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);
