import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import Library from "./pages/Library";
import StudyView from "./pages/StudyView";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from './contexts/AuthContext';
import Account from "./pages/Account";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
     <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/notes" element={<Notes />} />
          <Route path="/library" element={<Library />} />
          <Route path="/study/:id" element={<StudyView />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/account" element={<Account />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
