import { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router";
import { customRoutes } from "@/router/routes";
import { AuthProvider } from "@/context/AuthContext";
import Fallback from "@/components/ui/fallback";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {customRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.layout ? (
                  <route.layout>{route.children && <Outlet />}</route.layout>
                ) : (
                  <Outlet />
                )
              }
            >
              {route.children?.map((child) => (
                <Route key={child.path} path={child.path} element={<child.element />} />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
