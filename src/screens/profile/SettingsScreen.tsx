import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    try {
      await updateUser({
        displayName,
        username,
        bio,
      });
      showToast('Profile updated!', 'success');
      navigate(-1);
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-teal">Settings</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        <TextField
          label="Display Name"
          value={displayName}
          onChange={setDisplayName}
        />
        <TextField
          label="Username"
          value={username}
          onChange={setUsername}
        />
        <TextField
          label="Bio"
          value={bio}
          onChange={setBio}
          multiline
          rows={4}
        />

        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            className="rounded-2xl"
          >
            Save Changes
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
            iconLeft={<LogOut size={18} />}
            className="rounded-2xl"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Screen>
  );
}

