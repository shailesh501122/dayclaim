import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ModuleErrorBoundary } from './components/ErrorBoundary.jsx';
import { Shell } from './components/Shell.jsx';
import { AuthProvider } from './modules/auth/AuthContext.jsx';
import { LoginPage } from './modules/auth/LoginPage.jsx';
import { ProtectedRoute } from './modules/auth/ProtectedRoute.jsx';
import { RouteElement } from './modules/moduleRegistry.jsx';
import { ModulePage } from './modules/shared/ModulePage.jsx';
import { getAllModuleRoutes } from './routes/menuRoutes.js';

// Most of the ~200 generated modules are open to any authenticated staff
// role; only a small number of real (non-placeholder) screens need a
// narrower role check, listed here by their menu title.
const ROUTE_ROLE_REQUIREMENTS = {
  'User Role Management': ['Admin', 'Manager'],
};

function AdminLayout({ children, roles }) {
  return (
    <ProtectedRoute roles={roles}>
      <Shell>
        <main className="content">{children}</main>
      </Shell>
    </ProtectedRoute>
  );
}

function ModuleRoute({ route }) {
  return (
    <AdminLayout roles={ROUTE_ROLE_REQUIREMENTS[route.title]}>
      <ModuleErrorBoundary resetKey={route.path}>
        <Suspense fallback={<div className="section module-loading">Loading module...</div>}>
          <RouteElement route={route} />
        </Suspense>
      </ModuleErrorBoundary>
    </AdminLayout>
  );
}

export default function App() {
  const moduleRoutes = getAllModuleRoutes();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          {moduleRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<ModuleRoute route={route} />} />
          ))}
          <Route path="*" element={<AdminLayout><ModulePage title="Page Not Found" group="DayClaim.ai" /></AdminLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
