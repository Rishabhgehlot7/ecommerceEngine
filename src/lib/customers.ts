import { orders, type Order } from './orders';

export type Customer = {
    id: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
};

// This function processes the orders to generate a customer list.
// In a real application, this data would come from your database.
function generateCustomerData(orders: Order[]): Customer[] {
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
        const customerEmail = order.customer.email;
        let customer = customerMap.get(customerEmail);

        if (customer) {
            customer.orderCount += 1;
            customer.totalSpent += order.total;
        } else {
            customer = {
                id: `cust-${customerMap.size + 1}`, // Simple unique ID
                name: order.customer.name,
                email: order.customer.email,
                orderCount: 1,
                totalSpent: order.total,
            };
        }
        customerMap.set(customerEmail, customer);
    });

    return Array.from(customerMap.values());
}

export const customers: Customer[] = generateCustomerData(orders);
