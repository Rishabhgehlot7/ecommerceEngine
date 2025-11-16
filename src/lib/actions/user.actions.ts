
'use server';

import dbConnect from '../db';
import User, { type IUser } from '@/models/User';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { sign, verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../mail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const COOKIE_NAME = 'session_token';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `avatar-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  try {
    const url = await uploadFile(buffer, fileName);
    return url;
  } catch (error) {
    throw new Error("Failed to upload avatar image.");
  }
}

async function createSession(userId: string) {
  const token = sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getUserFromSession(): Promise<IUser | null> {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const decoded = verify(token, JWT_SECRET) as { userId: string };
        await dbConnect();
        const user = await User.findById(decoded.userId).populate('role').lean();
        if (!user || user.isGuest) return null; // Do not consider guest users as logged in
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}

export async function clearUserSession() {
    cookies().delete(COOKIE_NAME);
}


export async function signup(data: unknown) {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(', '));
  }
  const { firstName, lastName, email, password } = result.data;

  await dbConnect();

  const existingUser = await User.findOne({ email });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    if (existingUser.isGuest) {
      // Convert guest to full user
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = hashedPassword;
      existingUser.isGuest = false;
      await existingUser.save();
      await createSession(existingUser._id);
      
      const userObject = existingUser.toObject();
      delete userObject.password;
      return JSON.parse(JSON.stringify(userObject));
    } else {
      throw new Error('User with this email already exists.');
    }
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    isGuest: false,
  });

  await newUser.save();
  
  await createSession(newUser._id);
  
  const userObject = newUser.toObject();
  delete userObject.password;
  return JSON.parse(JSON.stringify(userObject));
}


export async function login(data: unknown) {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.errors.map(e => e.message).join(', '));
    }
    const { email, password } = result.data;

    await dbConnect();

    const user = await User.findOne({ email, isGuest: { $ne: true } }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }

    await createSession(user._id);

    const userObject = user.toObject();
    delete userObject.password;
    return JSON.parse(JSON.stringify(userObject));
}

export async function getUsers(): Promise<IUser[]> {
    await dbConnect();
    // Eagerly import Role model to prevent MissingSchemaError
    await Role.find({});
    const users = await User.find({ isGuest: { $ne: true } }).populate('role').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(users));
}

export async function getUser(id: string): Promise<IUser | null> {
    await dbConnect();
    const user = await User.findById(id).populate('role').lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
}

export async function getRoles(): Promise<IRole[]> {
  await dbConnect();
  const roles = await Role.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(roles));
}

export async function updateUser(formData: FormData) {
  await dbConnect();

  const id = formData.get('id') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const roleId = formData.get('role') as string;

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.firstName = firstName;
  user.lastName = lastName;
  
  if (roleId && roleId !== 'none') {
    user.role = roleId;
  } else {
    user.role = undefined;
  }

  await user.save();

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}/edit`);
}

export async function updateUserProfile(formData: FormData) {
    await dbConnect();
    
    const id = formData.get('id') as string;
    const user = await User.findById(id).select('+password');

    if (!user) {
        throw new Error('User not found.');
    }

    const firstName = formData.get('firstName') as string;
    if (firstName) user.firstName = firstName;

    const lastName = formData.get('lastName') as string;
    if (lastName) user.lastName = lastName;
    
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect current password.');
        }
        user.password = await bcrypt.hash(newPassword, 10);
    }
    
    const avatarFile = formData.get('avatar') as File | null;
    if (avatarFile && avatarFile.size > 0) {
        const avatarUrl = await uploadImage(avatarFile);
        if(avatarUrl) {
            user.avatar = avatarUrl;
        }
    } else if (!formData.has('currentImage')) {
        // If currentImage is not present, it means it was removed.
        user.avatar = undefined;
    }


    await user.save();
    revalidatePath('/profile');
    revalidatePath('.', 'layout'); // Revalidate layout to update UserNav avatar
}

export async function requestPasswordReset(email: string) {
    await dbConnect();
    const user = await User.findOne({ email, isGuest: { $ne: true } });

    // We don't want to reveal if a user exists or not, so we succeed silently.
    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();
    
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    
    try {
        await sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        // Don't throw to the client, but handle internally
        throw new Error('Could not send reset email. Please try again later.');
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    await dbConnect();

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
        throw new Error('Password reset token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in after password reset
    await createSession(user._id);
}
