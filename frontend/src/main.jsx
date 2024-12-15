import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import { Provider } from "react-redux";
import { store, persistor } from './redux/cartStore.js';
import { PersistGate } from 'redux-persist/integration/react';
const ProductList = lazy(() => import('./components/ProductList/ProductList.jsx'));
const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails.jsx'));
const Login = lazy(() => import('./components/Login/Login.jsx'));
const SignUp = lazy(() => import('./components/SignUp/SignUp.jsx'));
const Profiles = lazy(() => import('./components/Profiles/Profiles.jsx'));
const Cart = lazy(() => import('./components/Cart/Cart.jsx'));
const WishList = lazy(() => import('./components/WishList/WishList.jsx'));
const AddressBook = lazy(() => import('./components/AddressBook/AddressBook.jsx'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage/CheckoutPage.jsx'));
const OrderHistoryPage = lazy(() => import('./components/OrderHistoryPage/OrderHistoryPage.jsx'));
const Home = lazy(() => import('./components/Home/Home.jsx'));
const OrderConfirmationPage = lazy(() => import('./components/OrderConfirmPage/OrderConfirmPage.jsx'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <ProductList />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
          path: "profile",
        element: <Profiles />,
        children: [
          {
                path: "addaddress",
            element: <AddressBook />,
          },
        ],
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/wishlist",
        element: <WishList />,
      },
      {
        path: "/cart/checkout",
        element: <CheckoutPage />,
      },
    
      {
        path: "/order-history",
        element: <OrderHistoryPage />,
        },
        {
            path: "/order-confirmation",
            element:<OrderConfirmationPage/>
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>
);
