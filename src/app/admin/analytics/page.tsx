
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { useMemo } from 'react';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import type { IProduct } from '@/models/Product';
import type { IUser } from '@/models/User';
import type { IOrder, IOrderItem } from '@/models/Order';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfigBar = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  }
};

const chartConfigPie = {
  products: {
    label: 'Products',
  },
} as const;

export default function AnalyticsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        const [prods, userList, orderList] = await Promise.all([
          getProducts(),
          getUsers(),
          getOrders(),
        ]);
        setProducts(prods);
        setUsers(userList);
        setOrders(orderList);
        setLoading(false);
    }
    fetchData();
  }, []);

  const { totalRevenue, totalOrders, totalCustomers, topSellingProducts, productsPerCategory } = useMemo(() => {
    if (loading) {
      return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, topSellingProducts: [], productsPerCategory: [] };
    }
    
    const successfulOrders = orders.filter(o => o.status !== 'Pending' && o.status !== 'Failed');

    const totalRevenue = successfulOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = successfulOrders.length;
    const totalCustomers = users.length;

    const productSales = successfulOrders.reduce((acc, order) => {
        order.items.forEach((item: any) => {
            const productId = item.product?._id?.toString();
            if (productId && item.product?.name) {
                 if (!acc[productId]) {
                    acc[productId] = { name: item.product.name, sales: 0 };
                }
                acc[productId].sales += item.quantity;
            }
        });
        return acc;
    }, {} as Record<string, {name: string, sales: number}>);

    const topSellingProducts = Object.values(productSales).sort((a,b) => b.sales - a.sales).slice(0, 10);
    
    const categoryCount = products.reduce((acc, product) => {
        const categoryName = (product.category as any)?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const productsPerCategory = Object.entries(categoryCount).map(([name, products], index) => ({
      name, 
      products, 
      fill: `hsl(var(--chart-${index + 1}))`
    }));


    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      topSellingProducts,
      productsPerCategory
    };
  }, [loading, products, users, orders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const stats = [
    { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
    { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart },
    { title: 'Total Customers', value: totalCustomers.toString(), icon: Users },
    { title: 'Total Products', value: products.length.toString(), icon: Package },
  ];

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                  <p className="text-muted-foreground">Get insights into your store's performance.</p>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2"/></CardContent></Card>)}
            </div>
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 <Card>
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Products per Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                         <div className="mx-auto flex aspect-square h-full w-full max-w-[250px] items-center justify-center">
                            <Skeleton className="h-full w-full rounded-full" />
                         </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Your best performing products by units sold.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                </Card>
            </div>
          </div>
      )
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Get insights into your store's performance.</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Products per Category</CardTitle>
            <CardDescription>A breakdown of products across categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfigPie} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="products" hideLabel />} />
                <Pie data={productsPerCategory} dataKey="products" nameKey="name" innerRadius={60}>
                  {productsPerCategory.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
           <CardFooter className="flex-col gap-2 text-sm pt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              Showing distribution for {products.length} products.
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products by units sold.</CardDescription>
          </CardHeader>
          <CardContent>
             {topSellingProducts.length > 0 ? (
                <ChartContainer config={chartConfigBar} className="h-[250px] w-full">
                    <BarChart data={topSellingProducts} layout="vertical" margin={{ left: 20, right: 0, top: 5, bottom: 5}}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
                        <XAxis type="number" dataKey="sales"/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                </ChartContainer>
             ) : (
                <div className="flex h-[250px] items-center justify-center text-center text-muted-foreground">
                    No sales data available yet.
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
