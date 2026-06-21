import { createBrowserRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import RootLayout from '../layouts/RootLayout';
import CartLayout from '../layouts/CartLayout';
import OrderConfirmPage from '../pages/OrderConfirmPage';
import OrderLayout from '../layouts/OrderLayout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <CartLayout />,
        children: [
          {
            path: '/',
            element: <CartPage />,
          },
        ],
      },
      {
        element: <OrderLayout />,
        children: [
          {
            path: '/order/:id',
            element: <OrderConfirmPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
