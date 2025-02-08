import { Suspense } from "react";
import { Routes, Route } from "react-router";
import routes from "@/router/routes";
import Fallback from "@/components/ui/fallback";

function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
