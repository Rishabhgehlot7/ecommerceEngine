
import mongoose, { Schema, Document, models, model } from 'mongoose';
import { IRole } from './Role';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  role: mongoose.Types.ObjectId | IRole;
  googleId?: string;
  isGuest?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: false, select: false }, 
  avatar: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: false },
  googleId: { type: String, unique: true, sparse: true },
  isGuest: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (!this.password && !this.googleId && !this.isGuest) {
        next(new Error('A password is required if not signing up with Google or as a guest.'));
    } else {
        next();
    }
});


export default models.User || model<IUser>('User', UserSchema);
