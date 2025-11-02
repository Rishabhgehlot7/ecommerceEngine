
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
import { getCategory, updateCategory } from '@/lib/actions/category.actions';
import Image from 'next/image';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id);
  const updateCategoryWithId = updateCategory.bind(null, params.id);

  return (
    <form action={updateCategoryWithId} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
          <p className="text-muted-foreground">Update the details for the category.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" defaultValue={category.name} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={category.slug} />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input id="image" name="image" type="file" />
            <Input type="hidden" name="currentImage" value={category.image} />
            <Image src={category.image} alt={category.name} width={100} height={100} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={category.description} />
          </div>
          <div className="flex justify-end">
            <Button size="lg" type="submit">Update Category</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
