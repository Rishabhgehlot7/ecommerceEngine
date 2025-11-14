
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addBanner } from '@/lib/actions/banner.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ImageDropzone from '@/components/admin/image-dropzone';
import { Switch } from '@/components/ui/switch';

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const image = formData.get('image') as File;

    if (!image || image.size === 0) {
        alert('Please select an image for the banner.');
        return;
    }
    
    setLoading(true);

    try {
      await addBanner(formData);
      router.push('/admin/marketing');
    } catch (error) {
      console.error('Failed to add banner:', error);
      alert('Failed to add banner. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Banner</h2>
          <p className="text-muted-foreground">Create a new promotional banner.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Banner Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Banner Title</Label>
                <Input id="title" name="title" placeholder="e.g. Summer Sale" required/>
              </div>
              <div>
                <Label htmlFor="link">Link URL</Label>
                <Input id="link" name="link" placeholder="e.g. /products/summer-collection" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked={true} />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Banner Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <ImageDropzone name="image" />
                </CardContent>
            </Card>
            <Button size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Banner'}
            </Button>
        </div>
      </div>
    </form>
  );
}
