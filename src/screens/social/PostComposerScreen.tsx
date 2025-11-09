import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, DollarSign, Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { NumberStepper } from '../../components/forms/NumberStepper';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { DailyCookdCompletionModal } from '../../components/social/DailyCookdCompletionModal';
import { convertToDataURL } from '../../lib/utils';
import type { Recipe } from '../../types';

export function PostComposerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const addPost = useAppStore((state) => state.addPost);
  const pantry = useAppStore((state) => state.inventory);
  const updateInventoryItem = useAppStore((state) => state.updateInventoryItem);
  
  const imageUri = location.state?.imageUri as string | undefined;
  const imageFilter = location.state?.imageFilter as string | undefined;
  const draftRecipe = location.state?.draftRecipe as Recipe | undefined;
  const reCookFrom = location.state?.reCookFrom as string | undefined;
  const isDailyCookd = location.state?.isDailyCookd as boolean | undefined;
  
  const [caption, setCaption] = useState('');
  const [costPerServing, setCostPerServing] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [visibility, setVisibility] = useState<'friends' | 'global'>('friends');
  const [showPantrySelector, setShowPantrySelector] = useState(false);
  const [selectedPantryItems, setSelectedPantryItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (imageUri && imageUri.startsWith('blob:')) {
        URL.revokeObjectURL(imageUri);
      }
    };
  }, [imageUri]);

  const handleSubmit = async () => {
    if (!user || !imageUri) return;

    setIsSubmitting(true);
    try {
      // Convert blob URL to data URL for persistence
      const persistentImageUrl = await convertToDataURL(imageUri);

      const postUser = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        mealsShared: user.mealsShared,
        wasteReduced: user.wasteReduced,
        avgCostPerServing: user.avgCostPerServing,
        badges: user.badges,
      };

      const badges: string[] = [];
      // Add Daily Cook'd badge if posted through daily flow
      if (isDailyCookd) badges.push('DAILY-COOKD');
      if (costPerServing && costPerServing <= 5) badges.push('UNDER-$5');
      if (selectedPantryItems.length > 0) badges.push('NO-WASTE');
      if (rating >= 4) badges.push('DELICIOUS');

      const stats = costPerServing ? {
        costPerServing,
        wasteSaved: selectedPantryItems.length * 100, // Estimate
        expiringItemsUsed: selectedPantryItems.length,
      } : undefined;

      const newPost = {
        id: crypto.randomUUID(),
        userId: user.id,
        user: postUser,
        type: 'meal' as const,
        media: [persistentImageUrl], // Use data URL instead of blob URL
        caption: reCookFrom ? `Re-cooked this recipe! ${caption}` : caption,
        recipeId: draftRecipe?.id,
        recipe: draftRecipe,
        stats,
        badges: reCookFrom ? [...badges, 'RE-COOKED'] : badges,
        likes: 0,
        comments: 0,
        reCooks: 0,
        createdAt: new Date(),
        isLiked: false,
        isSaved: false,
      };
      
      addPost(newPost);

      // Optimistically reduce pantry item quantities
      selectedPantryItems.forEach((itemId) => {
        const item = pantry.find(i => i.id === itemId);
        if (item && item.quantity > 0) {
          const newQuantity = Math.max(0, item.quantity - 1);
          updateInventoryItem(itemId, { quantity: newQuantity });
        }
      });

      // Update sustainability tracking
      try {
        const stored = localStorage.getItem('sustainability_tracking');
        const tracking = stored ? JSON.parse(stored) : {
          daysCooked: 0,
          daysGoal: 5,
          moneySaved: 0,
          wasteSaved: 0,
          newRecipesLearned: 0,
          mealsShared: 0,
        };
        
        // Increment meals shared
        tracking.mealsShared = (tracking.mealsShared || 0) + 1;
        
        // Update money saved if cost provided
        if (costPerServing) {
          const estimatedEatingOut = 10; // Average cost of eating out
          const saved = estimatedEatingOut - costPerServing;
          if (saved > 0) {
            tracking.moneySaved = (tracking.moneySaved || 0) + saved;
          }
        }
        
        // Update waste saved
        if (stats?.wasteSaved) {
          tracking.wasteSaved = (tracking.wasteSaved || 0) + stats.wasteSaved;
        }
        
        localStorage.setItem('sustainability_tracking', JSON.stringify(tracking));
      } catch (error) {
        console.error('Error updating sustainability tracking:', error);
      }

      // Update last daily post date if this is a daily post
      if (isDailyCookd) {
        localStorage.setItem('last_daily_post_date', new Date().toDateString());
        showToast('Daily Cook\'d posted! 🔥 Keep your streak going!', 'success');
        // Show completion modal - it will handle navigation
        setShowCompletionModal(true);
      } else {
        showToast('Post created! 🎉', 'success');
        navigate('/home');
      }
    } catch (err) {
      showToast('Failed to create post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!imageUri) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">No image selected</p>
          <Button onClick={() => navigate('/post/capture')}>
            Go to Capture
          </Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="space-y-4 pb-24">
        {/* Image Preview */}
        <div className="relative w-full aspect-[4/5] bg-gray-100">
          <img
            src={imageUri}
            alt="Post preview"
            className={`w-full h-full object-cover ${
              imageFilter === 'vintage' ? 'sepia-50 contrast-110 brightness-95' :
              imageFilter === 'warm' ? 'sepia-30 brightness-105' :
              imageFilter === 'cool' ? 'hue-rotate-180 brightness-95' :
              imageFilter === 'bw' ? 'grayscale' :
              imageFilter === 'high-contrast' ? 'contrast-125 brightness-110' :
              imageFilter === 'bright' ? 'brightness-125 saturate-110' : ''
            }`}
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Caption */}
        <div className="px-4">
          <TextField
            label="What's cooking?"
            value={caption}
            onChange={setCaption}
            placeholder="Share your cooking story..."
            multiline
            rows={4}
          />
        </div>

        {/* Cost Per Serving */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-teal" />
            <label className="text-sm font-medium text-slate-700">
              Cost per serving
            </label>
          </div>
          <div className="flex items-center gap-2">
            <NumberStepper
              value={costPerServing || 0}
              onChange={(v) => setCostPerServing(v > 0 ? v : null)}
              min={0}
              max={100}
              step={0.5}
            />
            <span className="text-sm text-slate-600">USD</span>
          </div>
          <button
            onClick={() => setCostPerServing(null)}
            className="text-xs text-teal mt-1 hover:underline"
          >
            I'm not sure
          </button>
        </div>

        {/* Rating */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-teal" />
            <label className="text-sm font-medium text-slate-700">
              Your rating
            </label>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-2xl transition-transform active:scale-110"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Pantry Items Used */}
        <div className="px-4">
          <button
            onClick={() => setShowPantrySelector(true)}
            className="w-full flex items-center gap-2 p-3 bg-beige rounded-xl border border-sage/20"
          >
            <ShoppingCart size={20} className="text-teal" />
            <span className="flex-1 text-left text-sm font-medium text-slate-700">
              Items used
            </span>
            {selectedPantryItems.length > 0 && (
              <span className="px-2 py-1 bg-teal text-white rounded-full text-xs font-semibold">
                {selectedPantryItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Visibility */}
        <div className="px-4">
          <SegmentedControl
            value={visibility}
            onChange={(v) => setVisibility(v as 'friends' | 'global')}
            options={[
              { label: 'Friends', value: 'friends' },
              { label: 'Global', value: 'global' },
            ]}
          />
        </div>

        {/* Submit - Fixed above bottom nav */}
        <div className="fixed bottom-16 left-0 right-0 bg-brand-bg border-t border-gray-200 px-4 py-4 safe-area-bottom z-50 shadow-lg">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!caption.trim() || isSubmitting}
            className="rounded-2xl py-3 text-base font-semibold"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {/* Pantry Selector Bottom Sheet */}
      <BottomSheet
        isOpen={showPantrySelector}
        onClose={() => setShowPantrySelector(false)}
        title="Select items used"
      >
        <div className="max-h-96 overflow-y-auto space-y-2 p-4">
          {pantry.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-beige transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedPantryItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPantryItems([...selectedPantryItems, item.id]);
                  } else {
                    setSelectedPantryItems(selectedPantryItems.filter(id => id !== item.id));
                  }
                }}
                className="w-5 h-5 text-teal rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-600">
                  {item.quantity} {item.unit}
                </p>
              </div>
            </label>
          ))}
          {pantry.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No items in pantry yet
            </p>
          )}
        </div>
      </BottomSheet>

      {/* Daily Cook'd Completion Modal */}
      <DailyCookdCompletionModal
        isOpen={showCompletionModal}
        onClose={() => {
          setShowCompletionModal(false);
          navigate('/home');
        }}
      />
    </Screen>
  );
}

