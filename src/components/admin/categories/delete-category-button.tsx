
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteCategory, recoverCategory, deleteCategoryPermanently } from '@/lib/actions/category.actions';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ICategory } from '@/models/Category';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';


interface DeleteCategoryButtonProps {
  category: ICategory;
}

export default function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
  const { toast } = useToast();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({ title: successMessage });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred.' });
    }
  };

  return (
    <>
      {category.isDeleted ? (
        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); handleAction(() => recoverCategory(category._id), 'Category recovered')}}>
          <ArchiveRestore className="mr-2 h-4 w-4" />
          Recover
        </DropdownMenuItem>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive hover:!text-destructive">
              <Archive className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will soft delete the category. It can be recovered later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAction(() => deleteCategory(category._id), 'Category deleted')} className="bg-destructive hover:bg-destructive/90">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
           <DropdownMenuItem
            className="text-destructive hover:!text-destructive"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and all its subcategories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAction(() => deleteCategoryPermanently(category._id), 'Category deleted permanently')} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
