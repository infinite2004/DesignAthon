import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingFriendsScreen() {
  const navigate = useNavigate();
  const [friendUsernames, setFriendUsernames] = useState('');

  const handleNext = () => {
    // Save friends to localStorage (comma-separated usernames)
    if (friendUsernames.trim()) {
      const friends = friendUsernames.split(',').map(f => f.trim()).filter(Boolean);
      localStorage.setItem('user_friends', JSON.stringify(friends));
    }
    navigate('/onboarding/inventory');
  };

  const handleSkip = () => {
    navigate('/onboarding/inventory');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">Add friends</h1>
          <p className="text-slate-600">Connect with friends to share recipes and cooking tips</p>
        </div>

        <TextField
          label="Friend usernames (comma-separated)"
          value={friendUsernames}
          onChange={setFriendUsernames}
          placeholder="e.g., @chef_john, @vegan_cook"
        />

        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <p className="text-xs text-slate-600">
            💡 You can always add friends later from the explore page or search.
          </p>
        </div>

        <div className="pt-6 space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
            className="rounded-2xl"
          >
            Add Friends
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSkip}
            className="rounded-2xl"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </Screen>
  );
}

