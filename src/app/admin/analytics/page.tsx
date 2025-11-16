
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import AnalyticsClient from './analytics-client';


export default async function AnalyticsPage() {
  const [products, users, orders] = await Promise.all([
    getProducts(),
    getUsers(true), // get all users including guests to calculate new customers
    getOrders(),
  ]);

  return <AnalyticsClient products={products} users={users} orders={orders} />
}
