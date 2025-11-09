import { useState } from 'react';
import { X, Link2, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../state/authStore';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { formatCurrency } from '../../lib/utils';
import type { Post, Recipe } from '../../types';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { MediaPicker, type SelectedMedia } from '../../components/media/MediaPicker';
import { MultiMediaPicker } from '../../components/media/MultiMediaPicker';

type PostType = 'meal' | 'fridge' | 'tip';

export function CreatePostScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const addPost = useAppStore((state) => state.addPost);
  
  // Get recipe from location state if coming from "Cook Now & Share"
  const recipeFromState = location.state?.recipe as Recipe | undefined;
  const recipeIdFromState = location.state?.recipeId;
  const autoFill = location.state?.autoFill;
  
  const [postType, setPostType] = useState<PostType | null>(autoFill ? 'meal' : null);
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [caption, setCaption] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
    recipeIdFromState || null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(
    recipeFromState || null
  );
  const [showStats, setShowStats] = useState(autoFill || false);
  
  // For fridge/pantry posts: track before/after images
  const [beforeImage, setBeforeImage] = useState<SelectedMedia | null>(null);
  const [afterImage, setAfterImage] = useState<SelectedMedia | null>(null);

  const postTypes: { type: PostType; label: string; icon: string }[] = [
    { type: 'meal', label: 'I cooked a meal', icon: '🍳' },
    { type: 'fridge', label: 'Fridge / pantry before & after', icon: '🧊' },
    { type: 'tip', label: 'Tip / blog / review', icon: '💡' },
  ];

  // Optional upload function - can be connected to backend API
  const handleUpload = async (file: File): Promise<string> => {
    // In production, this would upload to your backend/storage service
    // For now, we'll use the blob URL as a placeholder
    // Example: const formData = new FormData(); formData.append('file', file);
    // const response = await fetch('/api/upload', { method: 'POST', body: formData });
    // return response.json().url;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
  };

  if (!user) {
    return (
      <Screen>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">You must be logged in to create a post.</p>
        </div>
      </Screen>
    );
  }

  const handlePost = () => {
    if (!postType || caption.trim() === '') return;

    // Convert authStore user to Post user format
    const postUser = {
      id: user.id,
      username: user.username,
      displayName: user.name,
      avatar: user.avatarUrl || undefined,
      bio: undefined,
      followers: 0,
      following: 0,
      mealsShared: 0,
      wasteReduced: 0,
      avgCostPerServing: 0,
      badges: [],
    };

    // Determine badges based on post type
    let badges: string[] = [];
    if (postType === 'fridge' && (beforeImage || afterImage)) {
      badges = ['BEFORE-AFTER', 'NO-WASTE'];
    } else if (postType === 'tip') {
      badges = ['TIP'];
    } else if (showStats) {
      badges = ['NO-WASTE', 'UNDER-$3'];
    }

    // Get recipe for meal posts
    let recipe: Recipe | undefined = undefined;
    if (postType === 'meal' && selectedRecipe) {
      recipe = selectedRecipe;
    } else if (postType === 'meal' && selectedRecipeId) {
      // Try to find recipe from existing posts
      const posts = useAppStore.getState().posts;
      const postWithRecipe = posts.find(p => p.recipeId === selectedRecipeId);
      recipe = postWithRecipe?.recipe;
    }

    // Calculate stats from recipe if available
    let stats = undefined;
    if (postType === 'meal' && recipe && showStats) {
      stats = {
        costPerServing: recipe.costEstimate || 2.50,
        wasteSaved: 350, // Could be calculated from inventory
        expiringItemsUsed: 3, // Could be calculated from inventory
      };
    } else if (postType === 'meal' && showStats) {
      stats = {
        costPerServing: 2.50,
        wasteSaved: 350,
        expiringItemsUsed: 3,
      };
    }

    // Convert SelectedMedia to string URLs for post
    const mediaUrls: string[] = [];
    if (postType === 'fridge') {
      if (beforeImage) mediaUrls.push(beforeImage.uploadedUrl || beforeImage.url);
      if (afterImage) mediaUrls.push(afterImage.uploadedUrl || afterImage.url);
    } else {
      mediaUrls.push(...media.map(m => m.uploadedUrl || m.url));
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: user.id,
      user: postUser,
      type: postType,
      media: mediaUrls,
      caption,
      recipeId: postType === 'meal' ? (selectedRecipeId || recipe?.id || undefined) : undefined,
      recipe: postType === 'meal' ? recipe : undefined,
      stats,
      badges,
      likes: 0,
      comments: 0,
      reCooks: 0,
      createdAt: new Date(),
    };

    addPost(newPost);
    // Invalidate React Query cache so feed updates
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    showToast('Post created successfully! 🎉', 'success');
    navigate('/feed');
  };

  return (
    <Screen>

      <div className="px-4 py-6 space-y-6">
        {/* Post Type Selection */}
        {!postType ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">What are you sharing?</h2>
            {postTypes.map((pt) => (
              <button
                key={pt.type}
                onClick={() => setPostType(pt.type)}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-sage active:bg-gray-50 transition-colors touch-target"
              >
                <span className="text-3xl">{pt.icon}</span>
                <span className="flex-1 text-left font-medium">{pt.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => {
                setPostType(null);
                setMedia([]);
                setCaption('');
                setSelectedRecipeId(null);
                setShowStats(false);
                setBeforeImage(null);
                setAfterImage(null);
              }}
              className="flex items-center gap-2 text-sm text-brand-teal mb-4 touch-target"
            >
              <ArrowLeft size={18} />
              <span>Change post type</span>
            </button>

            {/* Media Picker - Different UI for fridge vs other types */}
            {postType === 'fridge' ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Before & After Photos
                </label>
                
                {/* Before Image */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">Before</p>
                  <MediaPicker
                    media={beforeImage}
                    onChange={setBeforeImage}
                    onUpload={handleUpload}
                    showUploadProgress={true}
                    maxSize={10}
                    label=""
                  />
                </div>

                {/* After Image */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">After</p>
                  <MediaPicker
                    media={afterImage}
                    onChange={setAfterImage}
                    onUpload={handleUpload}
                    showUploadProgress={true}
                    maxSize={10}
                    label=""
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {postType === 'tip' ? 'Add Photo (Optional)' : 'Add Photo or Video'}
                </label>
                {postType === 'tip' ? (
                  <MediaPicker
                    media={media[0] || null}
                    onChange={(m) => setMedia(m ? [m] : [])}
                    onUpload={handleUpload}
                    showUploadProgress={true}
                    maxSize={10}
                    label=""
                  />
                ) : (
                  <MultiMediaPicker
                    media={media}
                    onChange={setMedia}
                    onUpload={handleUpload}
                    showUploadProgress={true}
                    maxSize={10}
                    maxFiles={5}
                    label=""
                  />
                )}
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  postType === 'fridge' 
                    ? "Share what you organized, what you used up, or any zero-waste wins..."
                    : postType === 'tip'
                    ? "Share your cooking tip, recipe review, or kitchen hack..."
                    : "Share your cooking story, tip, or experience..."
                }
                className="w-full min-h-[120px] p-3 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>

            {/* Recipe Attachment */}
            {postType === 'meal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe
                </label>
                {selectedRecipe ? (
                  <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-brand-teal mb-1">
                          {selectedRecipe.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {selectedRecipe.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRecipe(null);
                          setSelectedRecipeId(null);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 touch-target"
                        title="Remove recipe"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                      <span>{selectedRecipe.servings} servings</span>
                      <span>•</span>
                      <span>{selectedRecipe.prepTime + selectedRecipe.cookTime} min</span>
                      {selectedRecipe.costEstimate && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-brand-teal">
                            {formatCurrency(selectedRecipe.costEstimate)}/serving
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedRecipeId('1')}
                      className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-target"
                    >
                      <Link2 size={20} className="text-gray-400" />
                      <span className="flex-1 text-left text-sm">Pick from your recipes</span>
                      {selectedRecipeId && <Check size={20} className="text-brand-teal" />}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="w-full mt-2 flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-target"
                >
                  <span className="flex-1 text-left text-sm">Auto-fill stats from recipe</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    showStats ? 'bg-brand-teal border-brand-teal' : 'border-gray-300'
                  }`}>
                    {showStats && <Check size={14} className="text-white" />}
                  </div>
                </button>
              </div>
            )}

            {/* Stats Preview */}
            {showStats && selectedRecipe && (
              <div className="p-4 bg-brand-bg rounded-xl border border-brand-sage/20">
                <h3 className="font-semibold text-sm mb-3 text-brand-teal">Auto-filled Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cost per serving:</span>
                    <span className="font-semibold text-brand-teal">
                      {formatCurrency(selectedRecipe.costEstimate || 2.50)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Waste saved:</span>
                    <span className="font-semibold text-brand-teal">350g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expiring items used:</span>
                    <span className="font-semibold text-brand-teal">3</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 pb-6">
              <Button
                variant="primary"
                fullWidth
                onClick={handlePost}
                disabled={
                  !postType || 
                  caption.trim() === '' ||
                  (postType === 'fridge' && !beforeImage && !afterImage) ||
                  (postType === 'meal' && media.length === 0 && !selectedRecipe) ||
                  media.some(m => m.uploading) ||
                  beforeImage?.uploading ||
                  afterImage?.uploading
                }
                className="rounded-2xl"
              >
                {postType === 'fridge' ? 'Share Before & After' : postType === 'tip' ? 'Share Tip' : 'Post'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}

