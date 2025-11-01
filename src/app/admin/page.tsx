import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    title: 'Total Sales',
    value: '+12,234',
    change: '+19% from last month',
    icon: ShoppingCart,
  },
  {
    title: 'Active Users',
    value: '+573',
    change: '+201 since last hour',
    icon: Users,
  },
  {
    title: 'Total Products',
    value: '8',
    change: '2 new products added',
    icon: Package,
  },
];

const recentSales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '$1,999.00',
    product: 'Sky-Explorer V2',
    status: 'Shipped',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '$39.00',
    product: 'The Voyager',
    status: 'Processing',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '$299.00',
    product: 'Ortho-Comfort+',
    status: 'Shipped',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '$99.00',
    product: 'EchoSphere',
    status: 'Delivered',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '$129.00',
    product: 'Velocity Runners',
    status: 'Pending',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            A list of recent sales from your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.email}>
                  <TableCell>
                    <div className="font-medium">{sale.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sale.email}
                    </div>
                  </TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sale.status === 'Shipped' || sale.status === 'Delivered'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{sale.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
