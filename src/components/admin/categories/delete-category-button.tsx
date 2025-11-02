
'use client';

import { Button } from '@/components/ui/button';
import { deleteCategory } from '@/lib/actions/category.actions';

export default function DeleteCategoryButton({ id }: { id: string }) {
  return (
    <Button variant="destructive" onClick={async () => {
      await deleteCategory(id);
    }}>
      Delete
    </Button>
  );
}
