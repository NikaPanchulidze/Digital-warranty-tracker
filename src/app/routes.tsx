import { createBrowserRouter } from "react-router";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";

import { Login } from "@/features/auth/pages/Login";
import { Register } from "@/features/auth/pages/Register";
import { ForgotPassword } from "@/features/auth/pages/ForgotPassword";
import { ResetPassword } from "@/features/auth/pages/ResetPassword";
import { Dashboard } from "@/features/dashboard/pages/Dashboard";
import { Products } from "@/features/products/pages/Products";
import { AddProduct } from "@/features/products/pages/AddProduct";
import { ProductDetail } from "@/features/products/pages/ProductDetail";
import { Notifications } from "@/features/notifications/pages/Notifications";
import { Settings } from "@/features/settings/pages/Settings";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <Products /> },
          { path: "products/add", element: <AddProduct /> },
          { path: "products/:id", element: <ProductDetail /> },
          { path: "products/:id/edit", element: <AddProduct /> },
          { path: "notifications", element: <Notifications /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
