import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export function ProtectedRoute({ children, menuPath }) {
  const { isAuthenticated, menuAccessLoading, hasMenuAccess } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (menuPath) {
    if (menuAccessLoading) {
      return <div className="section module-loading">Loading...</div>;
    }
    if (!hasMenuAccess(menuPath)) {
      return (
        <div className="section" style={{ padding: '2rem' }}>
          <h2>Access restricted</h2>
          <p>You don't have permission to view this page. Ask an Admin to grant it from User Management.</p>
        </div>
      );
    }
  }

  return children;
}
