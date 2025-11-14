
"use client"

import type { IBanner } from "@/models/Banner";
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { deleteBanner } from "@/lib/actions/banner.actions";
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

function DeleteBannerButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto font-normal text-destructive hover:text-destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the banner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteBanner(id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export const columns: ColumnDef<IBanner>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Banner" />
      )
    },
    cell: ({ row }) => {
        const banner = row.original;
        return (
            <div className="flex items-center gap-4">
                <Image src={banner.image} alt={banner.title} width={80} height={40} className="rounded-md object-cover" />
                <div className="flex flex-col">
                    <span className="font-medium">{banner.title}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
        const link = row.original.link;
        return link ? <Link href={link} target="_blank" className="hover:underline truncate max-w-xs block" rel="noopener noreferrer">{link}</Link> : <span className="text-muted-foreground">None</span>
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const isActive = row.original.isActive;
        return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const banner = row.original
 
      return (
        <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/marketing/${banner._id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteBannerButton id={banner._id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
