import React, { useState } from 'react';
import { Screen } from '../../components/layout/Screen';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { useToast } from '../../components/ui/ToastContext';
import { TextField } from '../../components/forms/TextField';
import { Button } from '../../components/ui/Button';
import { MediaPicker, type SelectedMedia } from '../../components/media/MediaPicker';
import { Avatar } from '../../components/media/Avatar';

export const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<SelectedMedia | null>(null);

  if (!user) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Please sign in</p>
        </div>
      </Screen>
    );
  }

  const handleSave = () => {
    if (!name.trim() || !username.trim()) {
      showToast('Name and username are required', 'error');
      return;
    }

    // Update user in auth store
    setUser({
      ...user,
      name: name.trim(),
      username: username.trim(),
      avatarUrl: avatar?.url || user.avatarUrl,
    });

    // Save to localStorage for mock auth
    if (import.meta.env.DEV) {
      try {
        localStorage.setItem('mock_auth_user', JSON.stringify({
          ...user,
          name: name.trim(),
          username: username.trim(),
          avatarUrl: avatar?.url || user.avatarUrl,
        }));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }

    showToast('Profile updated successfully! ✅', 'success');
    navigate(-1);
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-brand-teal" />
          </button>
          <h1 className="text-sm font-semibold text-brand-teal">Edit Profile</h1>
          <div className="w-8" />
        </div>
      </header>
      
      <div className="px-4 py-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={avatar?.url || user.avatarUrl || undefined}
            initials={initials}
            size={100}
          />
          <MediaPicker
            label="Profile Photo"
            media={avatar}
            onChange={setAvatar}
          />
        </div>

        {/* Form Fields */}
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter your name"
        />

        <TextField
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="Enter username"
        />

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Bio (Optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="w-full min-h-[100px] p-3 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-xs"
            maxLength={200}
          />
          <p className="text-[10px] text-slate-400 mt-1">
            {bio.length}/200 characters
          </p>
        </div>

        {/* Save Button */}
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
      </div>
    </Screen>
  );
};

