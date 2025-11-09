import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show welcome screen for 2.5 seconds, then fade out and navigate
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const navigateTimer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          navigate('/feed', { replace: true });
        } else {
          // Navigate to login screen (which has sign up option)
          navigate('/auth/login', { replace: true });
        }
      }
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, user, isLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-teal transition-opacity duration-500">
      <div className="text-center px-4">
        <h1 
          className={`transition-all duration-500 ${
            fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ 
            fontFamily: '"Madimi One", cursive',
            fontSize: 'clamp(64px, 15vw, 96px)',
            fontWeight: 400,
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FFD07B',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          Cookd
        </h1>
      </div>
    </div>
  );
}

