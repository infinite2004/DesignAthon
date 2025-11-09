import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

// Auth Stack
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';

// Onboarding Stack
import { OnboardingGoalsScreen } from '../screens/onboarding/OnboardingGoalsScreen';
import { OnboardingDietScreen } from '../screens/onboarding/OnboardingDietScreen';
import { OnboardingBudgetScreen } from '../screens/onboarding/OnboardingBudgetScreen';
import { OnboardingInventoryBootstrapScreen } from '../screens/onboarding/OnboardingInventoryBootstrapScreen';

// Main Tab Navigator
import { MainTabNavigator } from './MainTabNavigator';

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginScreen />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignupScreen />}
        />

        {/* Onboarding Routes */}
        <Route
          path="/onboarding/goals"
          element={user ? <OnboardingGoalsScreen /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/onboarding/diet"
          element={user ? <OnboardingDietScreen /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/onboarding/budget"
          element={user ? <OnboardingBudgetScreen /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/onboarding/inventory"
          element={user ? <OnboardingInventoryBootstrapScreen /> : <Navigate to="/login" replace />}
        />

        {/* Main App (Protected) */}
        <Route
          path="/*"
          element={user ? <MainTabNavigator /> : <Navigate to="/login" replace />}
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

