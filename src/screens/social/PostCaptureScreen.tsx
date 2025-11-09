import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { Screen } from '../../components/layout/Screen';
import type { Recipe } from '../../types';

export function PostCaptureScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  
  // Get recipe data from location state if coming from "Cook Now & Share"
  const draftRecipe = location.state?.draftRecipe as Recipe | undefined;
  const recipeId = location.state?.recipeId as string | undefined;
  const reCookFrom = location.state?.reCookFrom as string | undefined;
  const isDailyCookd = location.state?.isDailyCookd as boolean | undefined;

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleCapture = (source: 'camera' | 'gallery') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'camera') {
      input.capture = 'environment';
    }
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUri = URL.createObjectURL(file);
        setBlobUrl(imageUri);
        // Navigate directly to composer
        navigate('/post/compose', {
          state: { 
            imageUri,
            draftRecipe,
            recipeId,
            reCookFrom,
            isDailyCookd,
          },
        });
      }
    };
    input.click();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Screen background="transparent">
      <div className="relative h-screen bg-black">
        {/* Camera Preview Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <Camera size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg opacity-75">
              {isDailyCookd ? 'Capture your Daily Cook\'d' : 'Camera preview'}
            </p>
            <p className="text-sm opacity-50 mt-2">Select an image to create a post</p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 safe-area-bottom">
          <div className="flex flex-col items-center gap-4 mb-4">
            {/* Source Toggle */}
            <div className="flex gap-2 bg-black/50 rounded-full p-1">
              <button
                onClick={() => handleCapture('camera')}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
              >
                <Camera size={18} className="inline mr-1" />
                Camera
              </button>
              <button
                onClick={() => handleCapture('gallery')}
                className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <ImageIcon size={18} className="inline mr-1" />
                Gallery
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-full text-sm font-medium text-white border border-white/50 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

