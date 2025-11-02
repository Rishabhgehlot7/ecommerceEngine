
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { addProduct } from '@/lib/actions/product.actions';
import { useRouter } from 'next/navigation';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
        const cats = await getAllCategories();
        setCategories(cats);
    }
    fetchCategories();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    },
  });

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setFiles(newFiles);
    setPreviews(newPreviews);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await addProduct(formData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. See console for details.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">Fill in the details for the new product.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="e.g. Summer T-Shirt" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="A short description of the product." required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="19.99" required/>
                </div>
                 <div>
                  <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                  <Input id="salePrice" name="salePrice" type="number" step="0.01" placeholder="14.99" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Add one or more images for your product.</CardDescription>
            </CardHeader>
            <CardContent>
                <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-primary' : 'border-input'}`}>
                    <input {...getInputProps()} />
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                </div>
                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative">
                                <Image src={src} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
           <Button size="lg" type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
           </Button>
        </div>
      </div>
    </form>
  );
}
