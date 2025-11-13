
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { seedPredefinedRoles } from '@/lib/actions/role.actions';
import { useToast } from '@/hooks/use-toast';

export default function SeedRolesButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const result = await seedPredefinedRoles();
      if (result.created > 0) {
        toast({
          title: 'Roles Seeded',
          description: `${result.created} new predefined role(s) have been created.`,
        });
      } else {
         toast({
          title: 'Roles Already Exist',
          description: `All predefined roles are already in the database.`,
        });
      }
    } catch (error) {
      console.error('Failed to seed roles:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create predefined roles. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSeed} disabled={loading}>
      <Rocket className="mr-2 h-4 w-4" />
      {loading ? 'Creating Roles...' : 'Create Predefined Roles'}
    </Button>
  );
}
