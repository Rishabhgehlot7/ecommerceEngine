
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
    let finalLogoUrl = currentSettings.logoUrl || '';

    const imageFile = formData.get('logo') as File | null;
    const currentLogoUrlFromForm = formData.get('currentImage');
    
    // If there's an image file, it means a new one was uploaded or an existing one was replaced.
    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
            finalLogoUrl = uploadedUrl;
        }
    } else if (currentLogoUrlFromForm === null) {
        // If there's no image file AND the currentImage field is not present, it means the image was removed.
        finalLogoUrl = '';
    } else {
        // If no new file and currentImage exists, keep the existing logo.
        finalLogoUrl = currentLogoUrlFromForm as string;
    }
    
    const updates = {
        storeName: formData.get('storeName') as string,
        contactEmail: formData.get('contactEmail') as string,
        storeAddress: formData.get('storeAddress') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string,
        socials: {
            facebook: formData.get('socials.facebook') as string,
            instagram: formData.get('socials.instagram') as string,
            twitter: formData.get('socials.twitter') as string,
            youtube: formData.get('socials.youtube') as string,
        },
        theme: formData.get('theme') as 'light' | 'dark' | 'system',
        font: formData.get('font') as string,
        primaryColor: formData.get('primaryColor') as string,
        logoUrl: finalLogoUrl,
    };

    const settings = await Setting.findOneAndUpdate({}, updates, { new: true, upsert: true, setDefaultsOnInsert: true });
    
    revalidatePath('/admin/settings', 'layout');
    revalidatePath('/', 'layout');

    return JSON.parse(JSON.stringify(settings));
}
