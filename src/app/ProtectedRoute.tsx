import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

