import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantAdminDashboard from "./pages/RestaurantAdminDashboard";
import PublicMenu from "./pages/PublicMenu";
import MenuSettings from "./pages/MenuSettings";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Super Admin pages */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Restaurant Admin pages */}
          <Route path="/admin/restaurant" element={<AdminDashboard />} />
          <Route path="/restaurant-admin" element={<RestaurantAdminDashboard />} />
          <Route path="/menu-settings" element={<MenuSettings />} />

          {/* Customer experience - PUBLIC MENU */}
          <Route path="/menu/:slug" element={<PublicMenu />} />
          <Route path="/:slug" element={<PublicMenu />} />

          {/* Placeholder routes for future implementation */}
          <Route path="/menu" element={<Placeholder />} />
          <Route path="/orders" element={<Placeholder />} />
          <Route path="/users" element={<Placeholder />} />
          <Route path="/qr" element={<Placeholder />} />
          <Route path="/experience" element={<Placeholder />} />
          <Route path="/settings" element={<Placeholder />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
