import { Document, Schema } from "mongoose";

interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  profileUrl?: string;
  coverImage?: string;
  posts?: Schema.Types.ObjectId[];
  followers?: Schema.Types.ObjectId;
  following?: Schema.Types.ObjectId;
  music?: Schema.Types.ObjectId[];
  password: string;
  isVerified?: boolean;
  refreshToken?: string;

  matchPassword(password: string): Promise<boolean>;
  tempToken(): Promise<string>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

export default IUser;
