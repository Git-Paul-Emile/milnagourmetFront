import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ToastContainer } from "@/components/Layout/ToastContainer";
import { GlobalEffects } from "@/components/GlobalEffects";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { AdminLogin } from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import LegalNotices from "./pages/LegalNotices";

const queryClient = new QueryClient();

const App = () => {
  console.log('App rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <AuthProvider>
            <ThemeProvider>
              <BrandingProvider>
                <GlobalEffects />
                <Toaster />
                <Sonner />
                <ToastContainer />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                    <Route path="/conditions-utilisation" element={<TermsOfUse />} />
                    <Route path="/mentions-legales" element={<LegalNotices />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requiredRole="ADMIN" adminLoginPath="/admin/login">
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </BrandingProvider>
            </ThemeProvider>
          </AuthProvider>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
