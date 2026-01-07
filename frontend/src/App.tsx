import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { RfmAnalysis } from './pages/RfmAnalysis';
import { FunnelAnalysis } from './pages/FunnelAnalysis';
import { CohortAnalysis } from './pages/CohortAnalysis';
import { Recommendations } from './pages/Recommendations';
import { Campaigns } from './pages/Campaigns';
import { AiInsights } from './pages/AiInsights';
import { Callback } from './pages/Callback';
import { AuthSuccess } from './pages/AuthSuccess';
import { AuthError } from './pages/AuthError';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="rfm" element={<RfmAnalysis />} />
            <Route path="funnel" element={<FunnelAnalysis />} />
            <Route path="cohort" element={<CohortAnalysis />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="ai-insights" element={<AiInsights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
