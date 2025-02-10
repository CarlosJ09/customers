import { lazy } from "react";
import BaseLayout from "@/layouts/BaseLayout";

const SignInPage = lazy(() => import("@/pages/auth/sign-in"));
const SignUpPage = lazy(() => import("@/pages/auth/sign-up"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const CustomerPage = lazy(() => import("@/pages/customer/index"));
const CreateCustomerPage = lazy(() => import("@/pages/customer/create"));
const UpdateCustomerPage = lazy(() => import("@/pages/customer/edit"));

export const customRoutes = [
  {
    path: "/auth",
    children: [
      { path: "sign-in", element: SignInPage },
      { path: "sign-up", element: SignUpPage },
    ],
  },
  {
    path: "/",
    layout: BaseLayout,
    children: [
      { path: "/", element: CustomerPage },
      { path: "/customers/create", element: CreateCustomerPage },
      { path: "/customers/:id", element: UpdateCustomerPage },
      { path: "/dashboard", element: DashboardPage },
    ],
  },
];
