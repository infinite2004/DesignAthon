import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';

export function SignupScreen() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !displayName || !username) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signup(email, password, {
        displayName,
        username,
      });
      showToast('Account created! 🎉', 'success');
      navigate('/onboarding/goals');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Madimi One', color: '#00635D' }}>
            Cook'd
          </h1>
          <p className="text-center text-slate-600 mt-2">Join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <TextField
            label="Display Name"
            type="text"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Your name"
            disabled={loading}
            autoComplete="name"
          />

          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="@username"
            disabled={loading}
            autoComplete="username"
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            className="rounded-2xl"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-teal font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Screen>
  );
}

