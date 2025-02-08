import { lazy } from "react";
import BaseLayout from "@/layouts/BaseLayout";

const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Home = lazy(() => import("@/pages/Home"));

export const customRoutes = [
  {
    path: "/",
    layout: BaseLayout,
    children: [{ path: "/", element: Home }],
  },
  {
    path: "/auth",
    children: [
      { path: "sign-in", element: SignIn },
      { path: "sign-up", element: SignUp },
    ],
  },
];
