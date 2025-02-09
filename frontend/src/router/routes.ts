import { lazy } from "react";
import BaseLayout from "@/layouts/BaseLayout";

const SignInPage = lazy(() => import("@/pages/auth/sign-in"));
const SignUpPage = lazy(() => import("@/pages/auth/sign-up"));
const CustomerPage = lazy(() => import("@/pages/customer/index"));
const CreateCustomerPage = lazy(() => import("@/pages/customer/create"));

export const customRoutes = [
  {
    path: "/",
    layout: BaseLayout,
    children: [
      { path: "/", element: CustomerPage },
      { path: "/customers/create", element: CreateCustomerPage },
    ],
  },
  {
    path: "/auth",
    children: [
      { path: "sign-in", element: SignInPage },
      { path: "sign-up", element: SignUpPage },
    ],
  },
];
