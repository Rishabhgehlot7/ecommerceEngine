
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProduct, updateProduct } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { IProduct } from '@/models/Product';
import type { ICategory } from '@/models/Category';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [prod, cats] = await Promise.all([
        getProduct(params.id),
        getAllCategories()
      ]);
      setProduct(prod);
      setCategories(cats);
      if (prod) {
          const imageUrls = prod.media.map(m => m.url);
          setExistingImages(imageUrls);
          setPreviews(imageUrls);
      }
    }
    fetchData();
  }, [params.id]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    },
  });

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
        const fileIndex = index - existingImages.length;
        setFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    existingImages.forEach(url => formData.append('existingImages', url));
    files.forEach(file => formData.append('images', file));
    
    try {
        await updateProduct(params.id, formData);
        router.push('/admin/products');
    } catch (error) {
        console.error('Failed to update product:', error);
        alert('Failed to update product. Please check console for details.');
    } finally {
        setLoading(false);
    }
  };


  if (!product) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">Update the details for "{product.name}".</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" defaultValue={product.name} required /></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={product.description} required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required/></div>
                 <div><Label htmlFor="salePrice">Sale Price (Optional)</Label><Input id="salePrice" name="salePrice" type="number" step="0.01" defaultValue={product.salePrice} /></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Manage your product images.</CardDescription></CardHeader>
            <CardContent>
                <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-primary' : 'border-input'}`}>
                    <input {...getInputProps()} />
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                </div>
                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {previews.map((src, index) => {
                            const isExisting = index < existingImages.length && src === existingImages[index];
                            return (
                                <div key={src} className="relative">
                                    <Image src={src} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index, isExisting)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Category</CardTitle></CardHeader>
            <CardContent>
              <Select name="category" defaultValue={product.category._id.toString()} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id.toString()}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</Button>
        </div>
      </div>
    </form>
  );
}

