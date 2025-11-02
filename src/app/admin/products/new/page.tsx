
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
import type { IVariant, IDimensions } from '@/models/Product';
import Image from 'next/image';
import { UploadCloud, X, Trash2, PlusCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Separator } from '@/components/ui/separator';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Partial<IVariant>[]>([{ sku: '', price: 0, stock: 0, options: [{ name: '', value: ''}] }]);

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
  
  const handleVariantChange = (index: number, field: keyof IVariant, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  const handleVariantDimensionChange = (index: number, field: keyof IDimensions, value: string) => {
    const newVariants = [...variants];
    const variant = newVariants[index];
    if (!variant.dimensions) {
      variant.dimensions = { length: 0, width: 0, height: 0 };
    }
    (variant.dimensions as any)[field] = parseFloat(value) || 0;
    setVariants(newVariants);
  };

  const handleVariantOptionChange = (vIndex: number, oIndex: number, field: 'name' | 'value', value: string) => {
      const newVariants = [...variants];
      if (newVariants[vIndex].options) {
        newVariants[vIndex].options![oIndex][field] = value;
        setVariants(newVariants);
      }
  };

  const addVariant = () => {
      setVariants([...variants, { sku: '', price: 0, stock: 0, options: [{ name: '', value: ''}] }]);
  };
  
  const removeVariant = (index: number) => {
      setVariants(variants.filter((_, i) => i !== index));
  };
  
  const addVariantOption = (vIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[vIndex].options) {
        newVariants[vIndex].options!.push({ name: '', value: '' });
        setVariants(newVariants);
    }
  };

  const removeVariantOption = (vIndex: number, oIndex: number) => {
      const newVariants = [...variants];
      if (newVariants[vIndex].options) {
        newVariants[vIndex].options = newVariants[vIndex].options!.filter((_, i) => i !== oIndex);
        setVariants(newVariants);
      }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    files.forEach(file => {
      formData.append('images', file);
    });
    
    // Add variants to form data, filtering out those without an SKU
    formData.append('variants', JSON.stringify(variants.filter(v => v.sku)));


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
                  <Label htmlFor="salePrice">Sale Price (Discount)</Label>
                  <Input id="salePrice" name="salePrice" type="number" step="0.01" placeholder="14.99" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Add variants like color or size. Each variant can have its own price, stock, and shipping details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="p-4 border rounded-md space-y-4 relative bg-muted/20">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeVariant(vIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor={`variant-sku-${vIndex}`}>SKU</Label>
                        <Input id={`variant-sku-${vIndex}`} placeholder="TSHIRT-BLUE-M" value={variant.sku} onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor={`variant-price-${vIndex}`}>Variant Price</Label>
                        <Input id={`variant-price-${vIndex}`} type="number" step="0.01" placeholder="Overrides main price" value={variant.price || ''} onChange={(e) => handleVariantChange(vIndex, 'price', parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <Label htmlFor={`variant-stock-${vIndex}`}>Stock</Label>
                        <Input id={`variant-stock-${vIndex}`} type="number" placeholder="100" value={variant.stock || ''} onChange={(e) => handleVariantChange(vIndex, 'stock', parseInt(e.target.value))} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Options</Label>
                    {variant.options?.map((option, oIndex) => (
                       <div key={oIndex} className="flex items-end gap-2">
                           <div className="flex-1">
                               <Input placeholder="e.g. Color" value={option.name} onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'name', e.target.value)} />
                           </div>
                            <div className="flex-1">
                                <Input placeholder="e.g. Blue" value={option.value} onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'value', e.target.value)} />
                           </div>
                           <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => removeVariantOption(vIndex, oIndex)}>
                               <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                       </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addVariantOption(vIndex)}>Add Option</Button>
                  </div>
                  
                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm">Variant Shipping Details (Optional)</Label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                        <Label htmlFor={`variant-weight-${vIndex}`} className="text-xs">Weight (kg)</Label>
                        <Input id={`variant-weight-${vIndex}`} type="number" step="0.01" placeholder="0.5" value={variant.weight || ''} onChange={(e) => handleVariantChange(vIndex, 'weight', parseFloat(e.target.value))} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-length-${vIndex}`} className="text-xs">Length (cm)</Label>
                        <Input id={`variant-length-${vIndex}`} type="number" step="0.01" placeholder="30" value={variant.dimensions?.length || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'length', e.target.value)} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-width-${vIndex}`} className="text-xs">Width (cm)</Label>
                        <Input id={`variant-width-${vIndex}`} type="number" step="0.01" placeholder="20" value={variant.dimensions?.width || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'width', e.target.value)} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-height-${vIndex}`} className="text-xs">Height (cm)</Label>
                        <Input id={`variant-height-${vIndex}`} type="number" step="0.01" placeholder="5" value={variant.dimensions?.height || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'height', e.target.value)} />
                        </div>
                    </div>
                  </div>

                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addVariant}>Add Variant</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Default Shipping</CardTitle>
              <CardDescription>Default shipping details if a variant does not have its own.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.01" placeholder="0.5" />
                </div>
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input id="length" name="length" type="number" step="0.01" placeholder="30" />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input id="width" name="width" type="number" step="0.01" placeholder="20" />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" step="0.01" placeholder="5" />
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
