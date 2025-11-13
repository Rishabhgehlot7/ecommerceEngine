
'use server';

import dbConnect from '../db';
import Setting, { type ISettings } from '@/models/Setting';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

const defaultSettings = {
    storeName: 'BlueCart',
    contactEmail: 'sales@bluecart.com',
    storeAddress: '123 Market St, San Francisco, CA 94103',
    phone: '',
    whatsapp: '',
    socials: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
    },
    theme: 'light',
    font: 'inter',
    primaryColor: '#2563eb',
    logoUrl: '',
};

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  try {
    const url = await uploadFile(buffer, fileName);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload image.");
  }
}

export async function getSettings(): Promise<ISettings> {
    await dbConnect();
    let settings = await Setting.findOne().lean();
    if (!settings) {
        settings = (await new Setting(defaultSettings).save()).toObject();
    }
    
    const plainSettings = JSON.parse(JSON.stringify(settings));
    // Ensure nested objects exist for easier access on the client
    if (!plainSettings.socials) {
        plainSettings.socials = {};
    }
    return plainSettings;
}

export async function updateSettings(formData: FormData) {
    await dbConnect();

    const currentSettings = await getSettings();
    const updates: Partial<ISettings> = {};
    
    // Iterate over form entries and build updates object
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('socials.')) {
            const socialKey = key.split('.')[1];
            if (!updates.socials) updates.socials = {};
            (updates.socials as any)[socialKey] = value;
        } else {
            (updates as any)[key] = value;
        }
    }

    const imageFile = formData.get('logo') as File | null;
    
    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
            updates.logoUrl = uploadedUrl;
        }
    } else if (formData.has('logo') && !imageFile) {
        // This case handles when an existing image is removed but no new one is uploaded.
        // The dropzone component will not include the `currentImage` hidden input if removed.
        // We check if 'logo' key exists (from the file input) but is empty.
        updates.logoUrl = '';
    } else if (currentSettings.logoUrl) {
        // If no new image action, keep the old one
        updates.logoUrl = currentSettings.logoUrl;
    }


    const settings = await Setting.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true, setDefaultsOnInsert: true });
    
    revalidatePath('/admin/settings', 'layout');
    revalidatePath('/', 'layout');

    return JSON.parse(JSON.stringify(settings));
}
