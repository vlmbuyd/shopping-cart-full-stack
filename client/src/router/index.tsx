import { createBrowserRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import RootLayout from '../layouts/RootLayout';
import CartLayout from '../layouts/CartLayout';

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
    ],
  },
]);

export default router;
