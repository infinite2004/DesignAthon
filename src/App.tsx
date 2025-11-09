import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './components/ui/ToastContext';
import { RootNavigator } from './navigation/RootNavigator';

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;

