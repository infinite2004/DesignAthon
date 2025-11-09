import { useLocation } from 'react-router-dom';

const ONBOARDING_STEPS = [
  { path: '/onboarding/goals', step: 1, label: 'Goals' },
  { path: '/onboarding/budget', step: 2, label: 'Budget' },
  { path: '/onboarding/cooking-frequency', step: 3, label: 'Cooking Frequency' },
  { path: '/onboarding/diet', step: 4, label: 'Diet' },
  { path: '/onboarding/friends', step: 5, label: 'Friends' },
  { path: '/onboarding/inventory', step: 6, label: 'Inventory' },
];

const TOTAL_STEPS = 6;

export function OnboardingProgress() {
  const location = useLocation();
  const currentStep = ONBOARDING_STEPS.find(s => s.path === location.pathname)?.step || 1;
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-brand-teal">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <span className="text-xs text-slate-500">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-teal rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

