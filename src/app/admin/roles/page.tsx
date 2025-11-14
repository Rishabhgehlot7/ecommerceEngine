
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getRoles } from '@/lib/actions/role.actions';
import type { IRole } from '@/models/Role';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import SeedRolesButton from './seed-roles-button';
import {
  Card,
} from '@/components/ui/card';
import { RoleCard } from './role-card';

type RoleWithUserCount = IRole & { userCount: number };

export default async function AdminRolesPage() {
  const roles: RoleWithUserCount[] = await getRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage admin roles and what they can access.</p>
        </div>
        <div className="flex items-center gap-2">
          <SeedRolesButton />
          <Button asChild>
            <Link href="/admin/roles/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Role
            </Link>
          </Button>
        </div>
      </div>

       {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {roles.map((role) => (
          <RoleCard key={role._id} role={role} />
        ))}
         {roles.length === 0 && (
            <Card className="flex items-center justify-center p-10">
                <p className="text-muted-foreground">No roles found.</p>
            </Card>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={roles} />
      </div>

    </div>
  );
}
