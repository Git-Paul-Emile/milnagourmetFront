import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { ShellUiProvider } from "@/contexts/ShellUiContext";
import { ToastContainer } from "@/components/Layout/ToastContainer";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { PageLoader } from "@/components/PageLoader";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { UpdatePrompt } from "@/components/shared/UpdatePrompt";
import { BottomNav } from "@/components/Layout/BottomNav";
import Index from "./pages/Index";

// Chargées à la demande : réduit fortement le bundle initial (dashboard admin
// avec recharts/xlsx, pages secondaires) puisqu'elles ne servent qu'à une
// fraction des visiteurs.
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const AdminLogin = lazy(() => import("./pages/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const LegalNotices = lazy(() => import("./pages/LegalNotices"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

const App = () => {
  return (
    // ErrorBoundary au sommet : sans lui, une exception de rendu dans
    // n'importe quel composant affiche une page entièrement blanche.
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <AuthProvider>
            <BrandingProvider>
              <ShellUiProvider>
                <Toaster />
                <Sonner />
                <ToastContainer />
                {/* Éléments PWA : invite d'installation, bandeau de mise à
                    jour et indicateur hors connexion. Placés hors du
                    routeur, ils restent visibles sur toutes les pages. */}
                <UpdatePrompt />
                <InstallPrompt />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                      <Route path="/conditions-utilisation" element={<TermsOfUse />} />
                      <Route path="/mentions-legales" element={<LegalNotices />} />
                      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                      <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
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
                  </Suspense>
                  {/* Dans le routeur : la barre utilise useNavigate et
                      useLocation. Elle ne s'affiche qu'en mode installé. */}
                  <BottomNav />
                </BrowserRouter>
              </ShellUiProvider>
            </BrandingProvider>
          </AuthProvider>
        </AppProvider>
      </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
