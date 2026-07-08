import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell.jsx';
import { LoginPage } from './modules/auth/LoginPage.jsx';
import { RouteElement } from './modules/moduleRegistry.jsx';
import { ModulePage } from './modules/shared/ModulePage.jsx';
import { getAllModuleRoutes } from './routes/menuRoutes.js';

function AdminLayout({ children }) {
  return (
    <Shell>
      <main className="content">{children}</main>
    </Shell>
  );
}

export default function App() {
  const moduleRoutes = getAllModuleRoutes();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        {moduleRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminLayout><RouteElement route={route} /></AdminLayout>}
          />
        ))}
        <Route path="*" element={<AdminLayout><ModulePage title="Page Not Found" group="DayClaim.ai" /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
