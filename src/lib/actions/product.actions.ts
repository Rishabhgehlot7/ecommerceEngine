
'use server';

import dbConnect from '../db';
import Product, { type IProduct } from '@/models/Product';
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '../s3';
import { Types } from 'mongoose';

async function uploadImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    try {
      const url = await uploadFile(buffer, fileName);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(`Failed to upload image: ${file.name}`);
    }
  });
  return Promise.all(uploadPromises);
}

function getSlug(name: string) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function addProduct(formData: FormData) {
  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined;
  const categoryId = formData.get('category') as string;
  const images = formData.getAll('images') as File[];

  if (!name || !description || !price || !categoryId || images.length === 0) {
    throw new Error('Missing required fields');
  }

  const imageUrls = await uploadImages(images);
  const slug = getSlug(name);
  
  const newProduct = new Product({
    name,
    slug,
    description,
    price,
    salePrice,
    category: new Types.ObjectId(categoryId),
    media: imageUrls.map(url => ({ type: 'image', url })),
  });

  await newProduct.save();

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function getProducts(): Promise<IProduct[]> {
    await dbConnect();
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
}


export async function getProduct(id: string): Promise<IProduct | null> {
    await dbConnect();
    const product = await Product.findById(id).populate('category');
    return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(id: string, formData: FormData) {
  await dbConnect();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined;
  const categoryId = formData.get('category') as string;
  const newImages = formData.getAll('images') as File[];
  const existingImageUrls = formData.getAll('existingImages') as string[];

  const product = await Product.findById(id);
  if (!product) {
      throw new Error('Product not found');
  }

  let uploadedImageUrls: string[] = [];
  if (newImages.length > 0 && newImages[0].size > 0) {
      uploadedImageUrls = await uploadImages(newImages);
  }
  
  const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

  product.name = name;
  product.slug = getSlug(name);
  product.description = description;
  product.price = price;
  product.salePrice = salePrice;
  product.category = new Types.ObjectId(categoryId);
  product.media = allImageUrls.map(url => ({ type: 'image', url }));

  await product.save();

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${product.slug}`);
}


export async function deleteProduct(id: string) {
  await dbConnect();
  
  await Product.findByIdAndDelete(id);

  revalidatePath('/admin/products');
}
