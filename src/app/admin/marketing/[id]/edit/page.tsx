
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBanner, updateBanner } from '@/lib/actions/banner.actions';
import type { IBanner } from '@/models/Banner';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import ImageDropzone from '@/components/admin/image-dropzone';
import { Switch } from '@/components/ui/switch';

export default function EditBannerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [banner, setBanner] = useState<IBanner | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const bannerData = await getBanner(id);
      setBanner(bannerData);
    }
    fetchData();
  }, [id]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
        await updateBanner(id, formData);
        router.push('/admin/marketing');
    } catch (error) {
        console.error('Failed to update banner:', error);
        alert('Failed to update banner. Please check console for details.');
    } finally {
        setLoading(false);
    }
  };


  if (!banner) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Banner</h2>
          <p className="text-muted-foreground">Update the details for the banner.</p>
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
                    <Input id="title" name="title" defaultValue={banner.title} required />
                </div>
                <div>
                    <Label htmlFor="link">Link URL</Label>
                    <Input id="link" name="link" defaultValue={banner.link} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="isActive" name="isActive" defaultChecked={banner.isActive} />
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
              <ImageDropzone name="image" initialImage={banner.image} />
              <Input type="hidden" name="currentImage" defaultValue={banner.image} />
            </CardContent>
          </Card>
          <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Banner'}</Button>
        </div>
      </div>
    </form>
  );
}
