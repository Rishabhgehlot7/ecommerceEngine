
import { getProducts } from '@/lib/actions/product.actions';
import { getUsers, getUserFromSession } from '@/lib/actions/user.actions';
import { getOrders } from '@/lib/actions/order.actions';
import AdminDashboardClient from './dashboard-client';


export default async function AdminDashboardPage() {
  const [products, users, orders, adminUser] = await Promise.all([
    getProducts(),
    getUsers(),
    getOrders(),
    getUserFromSession(),
  ]);

  return <AdminDashboardClient products={products} users={users} orders={orders} adminUser={adminUser} />
}
