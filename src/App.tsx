import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArticleDetail from "./pages/ArticleDetail";
import ArticlesList from "./pages/ArticlesList";
import ProductDetail from "./pages/ProductDetail";
import CreditApplication from "./pages/CreditApplication";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateArticle from "./pages/CreateArticle";
import CreateProduct from "./pages/CreateProduct";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/articles/create" element={<CreateArticle />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/credit" element={<CreditApplication />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
