import mongoose, { Schema, Document, Model } from "mongoose";

// Message subdocument
export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: { 
        type: String, 
        required: true, 
        trim: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  },
  { _id: false }
);

// Main User model
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: IMessage[];
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: { type: String, required: true },

    verifyCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },

    isVerified: { type: Boolean, default: false },
    isAcceptingMessage: { type: Boolean, default: true },

    messages: { type: [MessageSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent multiple model creation
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
