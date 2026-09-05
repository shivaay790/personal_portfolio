import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Consulting from "./pages/Consulting";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/consulting", element: <Consulting /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);


