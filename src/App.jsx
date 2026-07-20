import { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ModuleErrorBoundary } from './components/ErrorBoundary.jsx';
import { Shell } from './components/Shell.jsx';
import { AuthProvider } from './modules/auth/AuthContext.jsx';
import { LoginPage } from './modules/auth/LoginPage.jsx';
import { ProtectedRoute } from './modules/auth/ProtectedRoute.jsx';
import { RouteElement } from './modules/moduleRegistry.jsx';
import { ModulePage } from './pages/ModulePage.jsx';
import { getAllModuleRoutes } from './routes/menuRoutes.js';
import './styles/global.css';

/**
 * AdminLayout provides the protected shell for all internal pages.
 */
function AdminLayout({ children, menuPath }) {
  return (
    <ProtectedRoute menuPath={menuPath}>
      <Shell>
        <main className="content">{children}</main>
      </Shell>
    </ProtectedRoute>
  );
}

/**
 * ModuleRoute wraps individual routes with branding-aware title updates,
 * error boundaries, and suspense fallbacks.
 */
function ModuleRoute({ route }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Standardize page titles with A$cent branding
    if (route) {
      document.title = `${route.title} | A$cent Health Admin`;
    }
  }, [route, pathname]);

  return (
    <AdminLayout menuPath={route.path}>
      <ModuleErrorBoundary resetKey={route.path}>
        <Suspense fallback={<div className="section module-loading">Loading module data...</div>}>
          <RouteElement route={route} />
        </Suspense>
      </ModuleErrorBoundary>
    </AdminLayout>
  );
}

/**
 * Main Application Component
 */
export default function App() {
  const moduleRoutes = getAllModuleRoutes();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default to login, then redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dynamic Module Routes from menuRegistry */}
          {moduleRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<ModuleRoute route={route} />} />
          ))}
          
          {/* High-fidelity Fallback Page */}
          <Route 
            path="*" 
            element={
              <AdminLayout>
                <ModulePage title="Page Not Found" group="A$cent Health" />
              </AdminLayout>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
