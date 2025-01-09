import mongoose, { Schema, Document } from 'mongoose';

interface IAccessToken extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const AccessTokenSchema = new Schema<IAccessToken>({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresIn: { type: Number, required: true },
});

export const AccessToken = mongoose.models.AccessToken || mongoose.model('AccessToken', AccessTokenSchema);
