
'use server';

import dbConnect from '../db';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';

async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const url = await uploadFile(buffer, fileName);
  return url;
}

export async function addCategory(formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = '';
  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
  }

  const newCategory = new Category({
    name,
    slug,
    image: imageUrl,
    description,
  });

  await newCategory.save();

  revalidatePath('/admin/categories');
}

export async function getAllCategories() {
  await dbConnect();
  const categories = await Category.find({});
  return JSON.parse(JSON.stringify(categories));
}

export async function getCategory(id: string) {
  await dbConnect();
  const category = await Category.findById(id);
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl = formData.get('currentImage') as string;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  await Category.findByIdAndUpdate(id, {
    name,
    slug,
    image: imageUrl,
    description,
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath('/admin/categories');
}
