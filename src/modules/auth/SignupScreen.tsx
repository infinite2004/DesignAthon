import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/ToastContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Screen } from '../../components/layout/Screen';

export const SignupScreen: React.FC = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup(name, email, password);
      showToast('Account created!', 'success');
      navigate('/onboarding/goals', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed');
      showToast('Signup failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <div className="flex min-h-screen flex-col justify-center bg-brand-bg px-6">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 
              style={{ 
                fontFamily: '"Madimi One", cursive',
                fontSize: 'clamp(48px, 12vw, 64px)',
                fontWeight: 400,
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#FFD07B',
              }}
            >
              Cookd
            </h1>
          </div>
          
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-brand-teal">Create an account</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 touch-target"
              >
                {submitting ? <LoadingSpinner size={18} /> : 'Sign up'}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-medium text-slate-900">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

