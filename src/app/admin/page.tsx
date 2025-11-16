
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers, getUserFromSession } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import type { IOrder } from '@/models/Order';
import type { IUser } from '@/models/User';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default async function AdminDashboardPage() {
  const [products, users, orders, adminUser] = await Promise.all([
    getProducts(),
    getUsers(),
    getOrders(),
    getUserFromSession(),
  ]);

  const successfulOrders = orders.filter(o => o.status !== 'Pending' && o.status !== 'Failed');
  const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalSales = successfulOrders.length;
  
  const stats = [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue),
      change: `${totalSales} successful sales`,
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: `+${totalSales}`,
      change: `Across all time`,
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: `+${users.length}`,
      change: `${users.length} registered`,
      icon: Users,
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: `${products.length} products available`,
      icon: Package,
    },
  ];

  const recentSales: IOrder[] = orders.slice(0, 5);

  const salesByMonth = successfulOrders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    revenue: total,
  }));

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--chart-1))',
    },
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Shipped':
      case 'Delivered':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Failed':
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {adminUser?.firstName || 'Admin'}!</h2>
          <p className="text-muted-foreground">Here's a summary of your store's performance.</p>
        </div>
      </div>
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Your monthly sales revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
                Your 5 most recent sales.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {recentSales.length > 0 ? (
                    recentSales.map((sale) => {
                    const user = sale.user as IUser;
                    return (
                        <TableRow key={sale._id}>
                        <TableCell>
                            <Link href={`/admin/orders/${sale._id}`} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                                <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium hover:underline">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                            </div>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Badge
                            variant={getStatusVariant(sale.status)}
                            >
                            {sale.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(sale.totalAmount)}</TableCell>
                        </TableRow>
                    )
                    })
                ) : (
                    <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No recent sales.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
