
import { ALL_PERMISSIONS, PERMISSIONS } from './permissions';

export const PREDEFINED_ROLES = [
  {
    name: 'Super Admin',
    description: 'Has all permissions and can manage all aspects of the store.',
    permissions: ALL_PERMISSIONS,
  },
  {
    name: 'Product Manager',
    description: 'Can manage products, categories, and view analytics.',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.CATEGORIES_VIEW,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_EDIT,
      PERMISSIONS.CATEGORIES_DELETE,
      PERMISSIONS.ANALYTICS_VIEW,
    ],
  },
  {
      name: 'Order Manager',
      description: 'Can view and manage orders and customers.',
      permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.ORDERS_VIEW,
          PERMISSIONS.ORDERS_EDIT,
          PERMISSIONS.CUSTOMERS_VIEW,
          PERMISSIONS.ANALYTICS_VIEW,
      ]
  }
];
