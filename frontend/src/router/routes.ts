import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

export default routes;
