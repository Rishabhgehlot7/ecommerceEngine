
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
import { Button, buttonVariants } from '@/components/ui/button';
import { deleteCategory } from '@/lib/actions/category.actions';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteCategoryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  id: string;
  children?: React.ReactNode;
}

export default function DeleteCategoryButton({
  id,
  variant,
  className,
  children,
  ...props
}: DeleteCategoryButtonProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  const handleDelete = async () => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Failed to delete category:", error);
      // Optionally, show a toast notification on error
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={cn(buttonVariants({ variant, className }))} {...props}>
          {children || (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category and all of its subcategories.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: 'destructive' })}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
